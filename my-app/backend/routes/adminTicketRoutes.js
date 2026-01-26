import express from "express";
import Ticket from "../models/Ticket.js";
import adminAuth from "../middleware/adminAuth.js";
import { generateOtp } from "../utils/generateOtp.js";

const router = express.Router();

/* ================= 📊 TICKET OVERVIEW ================= */
router.get("/tickets/overview", adminAuth, async (req, res) => {
  try {
    const [total, open, assigned, resolved, closed] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Open" }),
      Ticket.countDocuments({ status: "Assigned" }),
      Ticket.countDocuments({ status: "Resolved" }),
      Ticket.countDocuments({ status: "Closed" }),
    ]);

    res.json({ total, open, assigned, resolved, closed });
  } catch {
    res.status(500).json({ msg: "Failed to load ticket overview" });
  }
});

/* ================= 📋 ALL TICKETS ================= */
router.get("/tickets", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email userId")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

/* ================= 🎯 ASSIGN TICKET ================= */
router.patch("/tickets/:id/assign", adminAuth, async (req, res) => {
  const { assignedTo } = req.body;
  if (!assignedTo)
    return res.status(400).json({ msg: "Assigned staff is required" });

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    if (ticket.status === "Closed")
      return res.status(400).json({ msg: "Cannot assign closed ticket" });

    ticket.assignedTo = assignedTo;
    ticket.status = "Assigned";

    await ticket.save();
    res.json({ msg: "Ticket assigned successfully", ticket });
  } catch {
    res.status(500).json({ msg: "Failed to assign ticket" });
  }
});

/* ================= ⏰ SLA ALERTS ================= */
router.get("/tickets/sla-alerts", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({
      status: { $ne: "Closed" },
      slaDueAt: { $lt: new Date() },
    })
      .populate("createdBy", "name")
      .populate("assignedTo", "name");

    res.json(tickets);
  } catch {
    res.status(500).json({ msg: "Failed to load SLA alerts" });
  }
});

/* ================= 🔐 RESOLVE (GENERATE OTP) ================= */
router.patch("/tickets/:id/resolve", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (!ticket.assignedTo)
      return res.status(400).json({ msg: "Assign staff before resolving" });

    if (ticket.status === "Resolved")
      return res.status(400).json({ msg: "OTP already generated" });

    if (ticket.status === "Closed")
      return res.status(400).json({ msg: "Ticket already closed" });

    const otp = generateOtp();

    ticket.status = "Resolved";
    ticket.otp = otp;
    ticket.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    ticket.otpVerified = false;

    await ticket.save();

    res.json({
      msg: "Ticket resolved. OTP generated.",
      ticketId: ticket._id,
      otp, // ⚠️ remove in production
    });
  } catch {
    res.status(500).json({ msg: "Failed to generate OTP" });
  }
});

/* ================= 🔐 CLOSE WITH OTP ================= */
router.patch("/tickets/:id/close-with-otp", adminAuth, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ msg: "OTP required" });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (ticket.status !== "Resolved")
      return res.status(400).json({ msg: "Ticket must be resolved first" });

    if (!ticket.otp || ticket.otpExpiresAt < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    if (String(ticket.otp) !== String(otp))
      return res.status(400).json({ msg: "Invalid OTP" });

    ticket.status = "Closed";
    ticket.closedAt = new Date();
    ticket.otpVerified = true;
    ticket.otp = null;
    ticket.otpExpiresAt = null;

    await ticket.save();
    res.json({ msg: "Ticket closed successfully" });
  } catch {
    res.status(500).json({ msg: "Failed to close ticket" });
  }
});

/* ================= 👤 ASSIGNED ACTIVE TICKETS ================= */
router.get("/tickets/assigned", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({
      assignedTo: { $ne: null },
      status: { $ne: "Closed" },
    })
      .populate("assignedTo", "name")
      .populate("createdBy", "name userId");

    res.json(tickets);
  } catch {
    res.status(500).json({ msg: "Failed to load assigned tickets" });
  }
});

export default router;
