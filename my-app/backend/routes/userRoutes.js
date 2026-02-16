import express from "express";
import User from "../models/User.js";
import Dues from "../models/Dues.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get current user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role || "user",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/user/dues
// @desc    Get latest due for the logged-in user
router.get("/dues", protect, async (req, res) => {
  try {
    const latestDue = await Dues.findOne({ user: req.user._id })
      .sort({ dueDate: -1 })
      .lean();
    res.json({ dues: latestDue || null });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile (Phone number for OTP)
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Update phone number to +918652718080
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
