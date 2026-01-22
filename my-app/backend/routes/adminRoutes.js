import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Dues from "../models/Dues.js";
import adminAuth from "../middleware/adminAuth.js";
import axios from "axios";

const router = express.Router();

/* =========================================================
   🔐 DEFAULT ADMIN SEEDER (RUNS ON SERVER START)
   ========================================================= */
const seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ adminId: "admin" });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Admin@123", salt);

      const defaultAdmin = new Admin({
        adminId: "admin",
        password: hashedPassword,
      });

      await defaultAdmin.save();

      console.log("✅ Default Admin Created");
      console.log("➡ Admin ID: admin");
      console.log("➡ Password: Admin@123");
    } else {
      console.log("ℹ️ Default admin already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding default admin:", error.message);
  }
};

/* 🚀 Call seeder */
seedDefaultAdmin();

/* =========================================================
   ADMIN LOGIN
   ========================================================= */
router.post("/login", async (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide Admin ID and password" });
  }

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials (admin not found)" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials (password mismatch)" });
    }

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            id: admin.id,
            adminId: admin.adminId,
          },
        });
      },
    );
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    res.status(500).json({ msg: "Server error during admin login" });
  }
});

/* =========================================================
   CREATE DUES
   ========================================================= */
router.post("/dues", adminAuth, async (req, res) => {
  const { userId, amount, dueDate, type, notes } = req.body;

  if (!userId || !amount || !dueDate) {
    return res
      .status(400)
      .json({ msg: "Please provide userId, amount, and dueDate" });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User not found with userId: ${userId}` });
    }

    const newDue = new Dues({
      user: user._id,
      amount,
      dueDate,
      type: type || "Maintenance",
      notes: notes || "",
    });

    await newDue.save();
    res.status(201).json({ msg: "Due created successfully", due: newDue });
  } catch (err) {
    console.error("Error creating due:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   GET ALL RESIDENTS
   ========================================================= */
router.get("/residents", adminAuth, async (req, res) => {
  try {
    const residents = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(residents);
  } catch (err) {
    console.error("Error fetching residents:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   MAINTENANCE FORECAST (ML)
   ========================================================= */
router.post("/maintenance-forecast", adminAuth, async (req, res) => {
  try {
    const mlApiResponse = await axios.post(
      "http://127.0.0.1:5000/predict",
      req.body,
    );
    res.json(mlApiResponse.data);
  } catch (err) {
    console.error("Error calling ML API:", err.message);
    res.status(500).json({ msg: "Server error while getting forecast" });
  }
});

/* =========================================================
   GET ALL DUES
   ========================================================= */
router.get("/all-dues", adminAuth, async (req, res) => {
  try {
    const dues = await Dues.find({})
      .populate("user", "name userId")
      .sort({ dueDate: -1 });

    res.json(dues);
  } catch (err) {
    console.error("Error fetching all dues:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   UPDATE DUE STATUS
   ========================================================= */
router.patch("/dues/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;

  if (!status || !["Pending", "Paid", "Overdue"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status provided" });
  }

  try {
    const due = await Dues.findById(req.params.id);
    if (!due) return res.status(404).json({ msg: "Due not found" });

    due.status = status;
    await due.save();

    const updatedDue = await Dues.findById(due._id).populate(
      "user",
      "name userId",
    );

    res.json(updatedDue);
  } catch (err) {
    console.error("Error updating due status:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   ADMIN DASHBOARD STATS
   ========================================================= */
router.get("/dashboard-stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDues = await Dues.countDocuments();
    const paidDues = await Dues.countDocuments({ status: "Paid" });
    const pendingDues = await Dues.countDocuments({ status: "Pending" });
    const overdueDues = await Dues.countDocuments({ status: "Overdue" });

    res.json({
      totalUsers,
      totalDues,
      paidDues,
      pendingDues,
      overdueDues,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err.message);
    res
      .status(500)
      .json({ msg: "Server error while fetching dashboard stats" });
  }
});

export default router;
