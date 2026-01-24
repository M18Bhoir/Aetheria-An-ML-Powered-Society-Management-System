import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post("/signup", async (req, res) => {
  const { name, email, userId, password } = req.body;

  try {
    if (!name || !email || !userId || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExists = await User.findOne({
      $or: [{ userId }, { email }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ msg: "User already exists with that ID or Email" });
    }

    const user = await User.create({
      name,
      email,
      userId,
      password,
    });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      role: "user",
      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login User or Admin
 */
router.post("/login", async (req, res) => {
  const { userId, password, role } = req.body;

  try {
    // 🔒 Basic validation
    if (!userId || !password || !role) {
      return res.status(400).json({ msg: "Missing credentials" });
    }

    let account;
    let payload;

    if (role === "admin") {
      // Admin login
      account = await Admin.findOne({ adminId: userId });
      if (!account) {
        return res.status(400).json({ msg: "Invalid admin credentials" });
      }

      const isMatch = await account.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      payload = { admin: { id: account._id } };
    } else {
      // User login
      account = await User.findOne({ userId });
      if (!account) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await account.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      payload = { user: { id: account._id } };
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      role,
      user: {
        id: account._id,
        name: account.name || "Admin",
        userId: role === "admin" ? account.adminId : account.userId,
        email: account.email || "",
      },
    });
  } catch (err) {
    // 🔥 THIS WILL SHOW THE REAL ERROR IN TERMINAL
    console.error("🔥 LOGIN ERROR STACK TRACE:");
    console.error(err);

    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
});

export default router;
