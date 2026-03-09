import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import protect from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import twilio from "twilio";

const router = express.Router();

// Initialize Twilio client using environment variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
const serviceSid = process.env.TWILIO_SERVICE_SID;
const haveTwilioVerify = Boolean(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_SERVICE_SID,
);
const isE164 = (num) => /^\+\d{7,15}$/.test(num || "");

// =================================================================
// ADMIN ROUTES
// =================================================================

/**
 * @route   POST /api/tickets/:id/request-close
 * @desc    Trigger a Twilio Verify OTP to the resident's phone
 * @access  Private (Admin Only)
 */
router.post("/:id/request-close", adminAuth, async (req, res) => {
  try {
    if (!haveTwilioVerify) {
      return res.status(500).json({
        msg: "Twilio Verify not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID.",
      });
    }
    const ticket = await Ticket.findById(req.params.id).populate("createdBy");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    // Verify resident has a phone number
    const creator = ticket.createdBy;
    if (!creator) {
      return res.status(400).json({
        msg: "Ticket creator not found. The resident may have been deleted.",
      });
    }
    const phoneNumber = creator.phone;
    if (!phoneNumber) {
      return res.status(400).json({
        msg: "Resident does not have a registered phone number. Update their profile first.",
      });
    }
    if (!isE164(phoneNumber)) {
      return res.status(400).json({
        msg: "Invalid phone format. Use E.164 (e.g., +919876543210).",
      });
    }

    // Trigger Twilio Verify Service (sends SMS)
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    res.json({ msg: "OTP sent to resident's mobile" });
  } catch (err) {
    console.error("Twilio Send Error:", err);
    res.status(500).json({
      msg:
        (err?.message &&
          `Failed to send OTP: ${err.message}. Verify Twilio credentials and phone format.`) ||
        "Failed to send OTP. Check Twilio configuration.",
      code: err?.code,
    });
  }
});

/**
 * @route   POST /api/tickets/:id/verify-close
 * @desc    Confirm OTP and mark ticket as Closed
 * @access  Private (Admin Only)
 */
router.post("/:id/verify-close", adminAuth, async (req, res) => {
  const { otp } = req.body;

  if (!otp) return res.status(400).json({ msg: "OTP code is required" });

  try {
    if (!haveTwilioVerify) {
      return res.status(500).json({
        msg: "Twilio Verify not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID.",
      });
    }
    const ticket = await Ticket.findById(req.params.id).populate("createdBy");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const creator = ticket.createdBy;
    if (!creator) {
      return res.status(400).json({
        msg: "Ticket creator not found. The resident may have been deleted.",
      });
    }
    const phoneNumber = creator.phone;
    if (!phoneNumber || !isE164(phoneNumber)) {
      return res.status(400).json({
        msg: "Resident phone missing or invalid. Use E.164 (e.g., +919876543210).",
      });
    }

    // Validate the OTP code via Twilio
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === "approved") {
      ticket.status = "Closed";
      ticket.closedAt = new Date(); // Track when it was resolved
      await ticket.save();

      res.json({ msg: "Ticket verified and closed successfully", ticket });
    } else {
      res.status(400).json({ msg: "Invalid or expired OTP code" });
    }
  } catch (err) {
    console.error("Twilio Verify Error:", err);
    res.status(500).json({
      msg:
        (err?.message &&
          `Verification failed: ${err.message}. Check OTP and Twilio setup.`) ||
        "Verification process failed",
      code: err?.code,
    });
  }
});

/**
 * @route   GET /api/tickets/all
 * @desc    Fetch all tickets for Admin View
 */
router.get("/all", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate("createdBy", "name userId phone") // Ensure phone is included for Admin
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load admin ticket overview" });
  }
});

// =================================================================
// USER ROUTES
// =================================================================

/**
 * @route   GET /api/tickets/summary
 * @desc    Get counts of user's tickets by status
 */
router.get("/summary", protect, async (req, res) => {
  try {
    const [open, inProgress] = await Promise.all([
      Ticket.countDocuments({ createdBy: req.user._id, status: "Open" }),
      Ticket.countDocuments({
        createdBy: req.user._id,
        status: { $in: ["Assigned", "In Progress", "Pending Closure"] },
      }),
    ]);
    res.json({ open, inProgress });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load ticket summary" });
  }
});

/**
 * @route   POST /api/tickets/
 * @desc    Create a new ticket (Resident)
 */
// Inside ticketRoutes.js
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id, // Provided by protect middleware
      status: "Open",
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create ticket" });
  }
});

/**
 * @route   GET /api/tickets/user
 * @desc    Fetch tickets raised by the logged-in resident
 */
router.get("/user", protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load tickets" });
  }
});

/**
 * @route   GET /api/tickets/:id
 * @desc    Get specific ticket details
 */
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ticket ID" });
    }
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name phone")
      .populate("assignedTo", "name");

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
