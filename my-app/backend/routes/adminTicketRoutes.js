import express from "express";
import Ticket from "../models/Ticket.js";
import adminAuth from "../middleware/adminAuth.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpToResident } from "../utils/sendOtp.js";

const router = express.Router();

/* ================= 📊 TICKET OVERVIEW ================= */
router.get("/tickets/overview", adminAuth, async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: "Open" });
    const resolved = await Ticket.countDocuments({ status: "Resolved" });
    const closed = await Ticket.countDocuments({ status: "Closed" });

    res.json({ total, open, resolved, closed });
  } catch (err) {
    console.error("OVERVIEW ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.post("/tickets/:id/request-close", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "phone",
    );

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (ticket.status !== "Open" && ticket.status !== "In Progress") {
      return res.status(400).json({ msg: "Ticket not eligible for resolve" });
    }

    const otp = generateOtp();

    ticket.status = "Resolved";
    ticket.otp = otp;
    ticket.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    ticket.otpVerified = false;

    await ticket.save();

    // Optional: send OTP
    // await sendOtpToResident({ phone: ticket.createdBy.phone, otp });

    res.json({ msg: "OTP generated, ticket resolved" });
  } catch (err) {
    console.error("REQUEST CLOSE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

/* ================= 📋 ALL TICKETS ================= */
router.get("/tickets", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email userId")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

/* ================= 🔐 REQUEST CLOSE (SEND OTP) ================= */
router.post("/tickets/:id/request-close", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "email name",
    );

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (ticket.status === "Closed")
      return res.status(400).json({ msg: "Ticket already closed" });

    const otp = generateOtp();

    ticket.status = "Pending Closure";
    ticket.closeOtp = otp;
    ticket.otpExpiresAt = Date.now() + 10 * 60 * 1000;

    await ticket.save();

    // 📧 Send OTP to resident
    await sendOtpToResident(ticket.createdBy.email, otp);

    res.json({ msg: "OTP sent to resident for ticket closure" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

/* ================= ⏰ SLA ALERTS ================= */
router.get("/tickets/sla-alerts", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find({
      status: { $ne: "Closed" },
      slaDueAt: { $lt: new Date() },
    }).populate("createdBy", "name");

    res.json(tickets);
  } catch {
    res.status(500).json({ msg: "Failed to load SLA alerts" });
  }
});

export default router;
