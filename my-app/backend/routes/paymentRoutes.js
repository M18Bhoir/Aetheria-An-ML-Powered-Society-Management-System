// backend/routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Dues from "../models/Dues.js";

const router = express.Router();

// ---------------------------------------------------------
// REPLACED: Strict check with Conditional Initialization
// ---------------------------------------------------------
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn(
    "WARNING: Razorpay keys not set. Payment features will be unavailable.",
  );
}
// ---------------------------------------------------------

// @route   POST /create-order
// @desc    Create a Razorpay order for payment
// @access  Private (User)
router.post("/create-order", async (req, res) => {
  try {
    // SAFETY CHECK: Ensure razorpay is initialized before using it
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured. Please contact admin.",
      });
    }

    const { amount, dueId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: dueId || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create order",
    });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    // Check if razorpay instance exists
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured. Please contact admin.",
      });
    }

    const { order_id, razorpay_payment_id, razorpay_signature, dueId } =
      req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

    hmac.update(`${order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const due = await Dues.findById(dueId);
    if (!due) {
      return res.status(404).json({
        success: false,
        message: "Due not found",
      });
    }

    due.status = "Paid";
    due.paymentDetails = {
      paymentId: razorpay_payment_id,
      orderId: order_id,
      paidAt: new Date(),
    };

    await due.save();

    res.json({
      success: true,
      message: "Payment verified and database updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
});

export default router;
