import express from "express";
import protect from "../middleware/auth.js";
import User from "../models/User.js";
import Dues from "../models/Dues.js";

const router = express.Router();

/* ================= 👤 USER PROFILE ================= */
router.get("/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= 💰 USER DUES ================= */
// @route   GET /api/user/dues
// @desc    Get current user's most recent outstanding due
// @access  Private
router.get("/dues", protect, async (req, res) => {
  try {
    // ✅ FIX: use _id instead of id
    const userId = req.user._id;

    const latestDue = await Dues.findOne({
      user: userId,
      status: { $in: ["Pending", "Overdue"] },
    }).sort({ dueDate: 1 });

    if (!latestDue) {
      return res.json({
        dues: {
          amount: 0,
          status: "Paid",
          dueDate: null,
        },
      });
    }

    res.json({ dues: latestDue });
  } catch (err) {
    console.error("Error fetching user dues:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
