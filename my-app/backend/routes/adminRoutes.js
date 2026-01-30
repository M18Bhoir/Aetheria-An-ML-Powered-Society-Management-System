import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";

import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Dues from "../models/Dues.js";
// import Visitor from "../models/Visitor.js"; // 🔁 Uncomment when Visitor model exists
// import Notice from "../models/Notice.js";   // 🔁 Uncomment when Notice model exists

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================================================
   🔐 DEFAULT ADMIN SEEDER
   ========================================================= */
const seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ adminId: "admin" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await Admin.create({
        adminId: "admin",
        password: hashedPassword,
      });

      console.log("✅ Default Admin Created");
      console.log("➡ Admin ID: admin");
      console.log("➡ Password: Admin@123");
    } else {
      console.log("ℹ️ Default admin already exists");
    }
  } catch (err) {
    console.error("❌ Admin Seeder Error:", err.message);
  }
};

// Run once on server start
seedDefaultAdmin();

/* =========================================================
   🔐 ADMIN LOGIN
   ========================================================= */
router.post("/login", async (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({ msg: "Admin ID and password required" });
  }

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { admin: { id: admin._id } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      token,
      role: "admin",
      user: {
        id: admin._id,
        name: "Admin",
        userId: admin.adminId,
      },
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error during admin login" });
  }
});

/* =========================================================
   ➕ CREATE DUES
   ========================================================= */
router.post("/dues", adminAuth, async (req, res) => {
  const { userId, amount, dueDate, type, notes } = req.body;

  if (!userId || !amount || !dueDate) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const due = await Dues.create({
      user: user._id,
      amount,
      dueDate,
      type: type || "Maintenance",
      notes: notes || "",
    });

    res.status(201).json({ msg: "Due created", due });
  } catch (err) {
    console.error("CREATE DUE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   👥 GET ALL RESIDENTS
   ========================================================= */
router.get("/residents", adminAuth, async (req, res) => {
  try {
    const residents = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(residents);
  } catch (err) {
    console.error("FETCH RESIDENTS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   🤖 MAINTENANCE FORECAST (ML)
   ========================================================= */
router.post("/maintenance-forecast", adminAuth, async (req, res) => {
  try {
    const mlResponse = await axios.post(
      "http://127.0.0.1:5000/predict",
      req.body,
    );
    res.json(mlResponse.data);
  } catch (err) {
    console.error("ML API ERROR:", err.message);
    res.status(500).json({ msg: "ML service unavailable" });
  }
});

/* =========================================================
   📋 GET ALL DUES
   ========================================================= */
router.get("/all-dues", adminAuth, async (req, res) => {
  try {
    const dues = await Dues.find()
      .populate("user", "name userId")
      .sort({ dueDate: -1 });

    res.json(dues);
  } catch (err) {
    console.error("FETCH DUES ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   ✏️ UPDATE DUE STATUS
   ========================================================= */
router.patch("/dues/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;

  if (!["Pending", "Paid", "Overdue"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const due = await Dues.findById(req.params.id);
    if (!due) {
      return res.status(404).json({ msg: "Due not found" });
    }

    due.status = status;
    await due.save();

    const updatedDue = await Dues.findById(due._id).populate(
      "user",
      "name userId",
    );

    res.json(updatedDue);
  } catch (err) {
    console.error("UPDATE DUE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   📊 ADMIN DASHBOARD STATS
   ========================================================= */
router.get("/dashboard-stats", adminAuth, async (req, res) => {
  try {
    const residentCount = await User.countDocuments();
    const noticeCount = 0; // 🔁 Replace when Notice model exists
    const visitorCount = 0; // 🔁 Replace when Visitor model exists

    const dues = await Dues.find();

    const collected = dues
      .filter((d) => d.status === "Paid")
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const pending = dues
      .filter((d) => d.status !== "Paid")
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    res.json({
      residentCount,
      visitorCount,
      noticeCount,
      duesSummary: {
        collected,
        pending,
      },
    });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch dashboard stats" });
  }
});

/* ================= 📊 TICKET OVERVIEW ================= */
router.get("/tickets/overview", adminAuth, async (req, res) => {
  try {
    const [total, open, pendingClosure, closed] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Open" }),
      Ticket.countDocuments({ status: "Pending Closure" }),
      Ticket.countDocuments({ status: "Closed" }),
    ]);

    res.json({ total, open, pendingClosure, closed });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load overview" });
  }
});

/* ================= 📋 ALL TICKETS ================= */
router.get("/tickets", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name phone")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

/* ================= 🔐 REQUEST CLOSE (SEND OTP) ================= */
router.post("/tickets/:id/request-close", adminAuth, async (req, res) => {
  try {
    console.log("🔥 Request Close hit:", req.params.id);

    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "phone",
    );

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });

    if (ticket.status !== "Open") {
      return res.status(400).json({ msg: "Ticket not open" });
    }

    const otp = generateOtp();

    ticket.status = "Pending Closure";
    ticket.closeOtp = otp;
    ticket.otpExpiresAt = Date.now() + 10 * 60 * 1000;

    await ticket.save();

    // 🔧 TEMP: comment this if Twilio not ready
    await sendOtpToResident({
      phone: ticket.createdBy.phone,
      otp,
      channel: "sms",
    });

    res.json({ msg: "OTP sent to resident" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to request close" });
  }
});

export default router;
