import express from "express";
import Ticket from "../models/Ticket.js";
import adminAuth from "../middleware/adminAuth.js";
import { generateOtp } from "../utils/generateOtp.js";

const router = express.Router();

/* ================= 📊 TICKET OVERVIEW ================= */
router.get("/tickets/overview", adminAuth, async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: "Open" });
    const assigned = await Ticket.countDocuments({ status: "Assigned" });
    const closed = await Ticket.countDocuments({ status: "Closed" });

    res.json({ total, open, assigned, closed });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load ticket overview" });
  }
});

/* ================= 📋 ALL TICKETS ================= */
router.get("/tickets", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

/* ================= 🎯 ASSIGN TICKET ================= */
router.patch("/tickets/:id/assign", adminAuth, async (req, res) => {
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ msg: "Assigned person is required" });
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    ticket.assignedTo = assignedTo;
    ticket.status = "Assigned";

    await ticket.save();

    res.json({ msg: "Ticket assigned successfully", ticket });
  } catch (err) {
    res.status(500).json({ msg: "Failed to assign ticket" });
  }
});

/* ================= ⏰ SLA ALERTS ================= */
router.get("/tickets/sla-alerts", adminAuth, async (req, res) => {
  try {
    const now = new Date();

    const breachedTickets = await Ticket.find({
      status: { $ne: "Closed" },
      slaDueAt: { $lt: now },
    }).populate("createdBy", "name");

    res.json(breachedTickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load SLA alerts" });
  }
});

router.patch("/tickets/:id/close", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    if (ticket.status === "Closed") {
      return res.status(400).json({ msg: "Ticket already closed" });
    }

    ticket.status = "Closed";
    ticket.closedAt = new Date();

    await ticket.save();

    res.join({
      msg: "Ticket closed successfully",
      ticket,
    });
  } catch (err) {
    console.error("Close ticket error:", err.message);
    res.status(500).json({ msg: "Failed to close ticket" });
  }
});

router.patch("/tickets/:id/close-with-otp", adminAuth, async (req, res) => {
  const { otp } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

  if (!ticket.otp || ticket.otpExpiresAt < Date.now()) {
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (ticket.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  ticket.status = "Closed";
  ticket.closedAt = new Date();
  ticket.otpVerified = true;
  ticket.otp = null;
  ticket.otpExpiresAt = null;

  await ticket.save();

  res.json({ msg: "Ticket closed successfully" });
});

router.patch("/tickets/:id/resolve", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    if (ticket.status === "Closed") {
      return res.status(400).json({ msg: "Ticket already closed" });
    }

    // 🔐 Generate OTP
    const otp = generateOtp();

    ticket.status = "Resolved";
    ticket.otp = otp;
    ticket.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    ticket.otpVerified = false;

    await ticket.save();

    res.json({
      msg: "Ticket resolved. OTP generated.",
      ticketId: ticket._id,
    });
  } catch (err) {
    console.error("OTP generation error:", err.message);
    res.status(500).json({ msg: "Failed to generate OTP" });
  }
});

export default router;
