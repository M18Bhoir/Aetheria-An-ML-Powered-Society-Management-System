import express from "express";
import Ticket from "../models/Ticket.js";
import protect from "../middleware/auth.js"; // Using consistent auth

const router = express.Router();

router.post("/:id/verify-close-otp", protect, async (req, res) => {
  try {
    const { otp } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (String(ticket.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (ticket.status !== "Pending Closure") {
      return res.status(400).json({ msg: "Ticket is not pending closure" });
    }

    if (!ticket.otp || ticket.otpExpiresAt < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (String(ticket.otp) !== String(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    ticket.status = "Closed";
    ticket.closedAt = new Date();
    ticket.otp = null;
    ticket.otpExpiresAt = null;
    await ticket.save();

    res.json({ msg: "Ticket closed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed" });
  }
});

export default router;
