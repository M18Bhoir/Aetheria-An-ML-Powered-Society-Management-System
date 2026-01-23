// backend/routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Dues from "../models/Dues.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_signature, dueId } =
      req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      // Resolved: Implemented mandatory database update for verified payments
      const due = await Dues.findById(dueId);
      if (due) {
        due.status = "Paid";
        due.paymentDetails = {
          paymentId: razorpay_payment_id,
          orderId: order_id,
          paidAt: Date.now(),
        };
        await due.save();
      }

      return res.json({
        success: true,
        message: "Payment verified and database updated.",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

export default router;
