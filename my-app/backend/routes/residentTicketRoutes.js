import express from "express";
import Ticket from "../models/Ticket.js";
import residentAuth from "../middleware/residentAuth.js";

const router = express.Router();

/* ================= 🔐 VERIFY OTP & CLOSE (RESIDENT) ================= */
router.post("/tickets/:id/verify-close-otp", residentAuth, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ msg: "OTP required" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    /* 🔒 Ownership Check */
    if (String(ticket.createdBy) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ msg: "Not authorized to close this ticket" });
    }

    if (ticket.status === "Closed") {
      return res.status(400).json({ msg: "Ticket already closed" });
    }

    if (ticket.status !== "Pending Closure") {
      return res.status(400).json({ msg: "Ticket not pending closure" });
    }

    if (!ticket.closeOtp || ticket.otpExpiresAt < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (String(ticket.closeOtp) !== String(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    /* ✅ Close Ticket */
    ticket.status = "Closed";
    ticket.closedAt = new Date();
    ticket.closeOtp = null;
    ticket.otpExpiresAt = null;

    await ticket.save();

    res.json({ msg: "Ticket closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to verify OTP" });
  }
});

export default router;
