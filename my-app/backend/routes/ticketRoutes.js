import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import protect from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import twilio from "twilio";

const router = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// This variable must be a 'VA' SID from your Twilio Console
const serviceSid = process.env.TWILIO_SERVICE_SID;

router.post("/:id/request-close", adminAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("createdBy");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const phoneNumber = ticket.createdBy.phone;
    if (!phoneNumber) {
      return res.status(400).json({
        msg: "Resident does not have a registered phone number.",
      });
    }

    // Uses the VA SID to trigger the verification
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    res.json({ msg: "OTP sent to resident's mobile" });
  } catch (err) {
    console.error("Twilio Send Error:", err);
    res
      .status(500)
      .json({ msg: "Failed to send OTP. Check TWILIO_SERVICE_SID in .env" });
  }
});

router.post("/:id/verify-close", adminAuth, async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ msg: "OTP code is required" });

  try {
    const ticket = await Ticket.findById(req.params.id).populate("createdBy");
    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    const phoneNumber = ticket.createdBy.phone;

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === "approved") {
      ticket.status = "Closed";
      ticket.closedAt = new Date();
      await ticket.save();
      res.json({ msg: "Ticket verified and closed successfully", ticket });
    } else {
      res.status(400).json({ msg: "Invalid or expired OTP code" });
    }
  } catch (err) {
    console.error("Twilio Verify Error:", err);
    res.status(500).json({ msg: "Verification process failed" });
  }
});

// ... rest of your routes (GET /all, POST /, etc.) remain unchanged
export default router;
