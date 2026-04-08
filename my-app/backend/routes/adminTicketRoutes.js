import express from "express";
import Ticket from "../models/Ticket.js";
import adminAuth from "../middleware/adminAuth.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpToResident } from "../utils/sendOtp.js";

const router = express.Router();

/* ================= 📊 TICKET OVERVIEW ================= */
/* ================= 📊 TICKET OVERVIEW ================= */
router.get("/tickets/overview", adminAuth, async (req, res) => {
  try {
    // Aggregating counts for all statuses defined in the Ticket model
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the result into a clean object for the frontend
    const overview = {
      total: 0,
      open: 0,
      inProgress: 0,
      pendingClosure: 0,
      closed: 0,
    };

    stats.forEach((stat) => {
      overview.total += stat.count;
      if (stat._id === "Open") overview.open = stat.count;
      if (stat._id === "In Progress") overview.inProgress = stat.count;
      if (stat._id === "Pending Closure") overview.pendingClosure = stat.count;
      if (stat._id === "Closed") overview.closed = stat.count;
    });

    res.json(overview);
  } catch (err) {
    console.error("OVERVIEW ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch ticket statistics" });
  }
});

/* ================= 📋 ALL TICKETS ================= */
router.get("/tickets", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email phone")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

/* ================= 🔐 REQUEST CLOSE (GENERATE & SEND OTP) ================= */
// Consolidated into one route with proper status and field names
router.post("/tickets/:id/request-close", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "phone email name",
    );

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    // Allow resolution only if ticket is active
    if (["Closed", "Pending Closure"].includes(ticket.status)) {
      return res.status(400).json({ msg: "Ticket already resolved or closed" });
    }

    const otp = generateOtp();

    // Aligning with Ticket.js model fields
    ticket.status = "Pending Closure";
    ticket.otp = otp;
    ticket.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    ticket.otpVerified = false;

    await ticket.save();

    // Send OTP using the phone number populated from the User model
    if (ticket.createdBy && ticket.createdBy.phone) {
      await sendOtpToResident({
        phone: ticket.createdBy.phone,
        otp,
        channel: "sms",
      });
    }

    res.json({
      msg: "OTP sent to resident. Ticket marked as Pending Closure.",
    });
  } catch (err) {
    console.error("ADMIN RESOLVE ERROR:", err);
    res.status(500).json({ msg: "Failed to initiate ticket closure" });
  }
});

/* ================= ⏰ SLA ALERTS ================= */
router.get("/tickets/sla-alerts", adminAuth, async (req, res) => {
  try {
    // Requires 'slaDueAt' to be added to the Ticket Schema
    const tickets = await Ticket.find({
      status: { $nin: ["Closed", "Pending Closure"] },
      slaDueAt: { $lt: new Date() },
    }).populate("createdBy", "name");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load SLA alerts" });
  }
});

export default router;
