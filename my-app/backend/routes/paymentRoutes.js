import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Dues from '../models/Dues.js';
import User from '../models/User.js';

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const options = {
      amount: Number(amount),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);

    res.json(order);
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_signature, dueId } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log(`✅ Payment verified for order: ${order_id}`);

      // Optional DB update
      // const due = await Dues.findById(dueId);
      // if (due) {
      //   due.status = 'Paid';
      //   due.paymentDetails = { paymentId: razorpay_payment_id, orderId: order_id };
      //   await due.save();
      // }

      return res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});

// Send Public Key
router.get('/get-key', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

export default router;
