import express from "express";
import protect from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import GuestPass from "../models/GuestPass.js";
import User from "../models/User.js"; // To populate resident info

const router = express.Router();

// -------------------
// USER ROUTES
// -------------------

// @route   POST /api/guestpass/request
// @desc    User requests a new guest pass
// @access  Private (User)
router.post("/request", protect, async (req, res) => {
  const { guestName, visitDate, arrivalTime, departureTime, reason } = req.body;

  if (!guestName || !visitDate || !arrivalTime || !departureTime) {
    return res
      .status(400)
      .json({
        msg: "Guest Name, Visit Date, Arrival Time, and Departure Time are required.",
      });
  }

  // Validate time format (HH:mm)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(arrivalTime) || !timeRegex.test(departureTime)) {
    return res
      .status(400)
      .json({ msg: "Invalid time format. Use HH:mm (24-hour format)." });
  }

  // Validate that departure time is after arrival time
  const [arrivalHour, arrivalMin] = arrivalTime.split(":").map(Number);
  const [departureHour, departureMin] = departureTime.split(":").map(Number);
  const arrivalMinutes = arrivalHour * 60 + arrivalMin;
  const departureMinutes = departureHour * 60 + departureMin;

  if (departureMinutes <= arrivalMinutes) {
    return res
      .status(400)
      .json({ msg: "Departure time must be after arrival time." });
  }

  try {
    const newPass = new GuestPass({
      requestedBy: req.user.id,
      guestName,
      visitDate: new Date(visitDate),
      arrivalTime,
      departureTime,
      reason,
      status: "Pending",
    });

    await newPass.save();
    const pass = await GuestPass.findById(newPass._id).populate(
      "requestedBy",
      "name userId",
    );
    res.status(201).json(pass);
  } catch (err) {
    console.error("Error creating guest pass request:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET /api/guestpass/my
// @desc    User gets their own guest passes
// @access  Private (User)
router.get("/my", protect, async (req, res) => {
  try {
    const passes = await GuestPass.find({ requestedBy: req.user.id })
      .populate("requestedBy", "name userId")
      .populate("handledBy", "adminId") // Show which admin handled it
      .sort({ visitDate: -1 }); // Show upcoming/recent first
    res.json(passes);
  } catch (err) {
    console.error("Error fetching user guest passes:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PATCH /api/guestpass/:id/cancel
// @desc    User cancels their own PENDING guest pass request
// @access  Private (User)
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const pass = await GuestPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({ msg: "Guest pass not found" });
    }
    // Check if user owns this pass and if it's pending
    if (pass.requestedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    if (pass.status !== "Pending") {
      return res
        .status(400)
        .json({ msg: "Only pending passes can be cancelled" });
    }

    pass.status = "Cancelled";
    await pass.save();

    const updatedPass = await GuestPass.findById(pass._id).populate(
      "requestedBy",
      "name userId",
    );
    res.json(updatedPass);
  } catch (err) {
    console.error("Error cancelling guest pass:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// -------------------
// ADMIN ROUTES
// -------------------

// @route   GET /api/guestpass/all
// @desc    Admin gets all guest passes from all users
// @access  Private (Admin Only)
router.get("/all", adminAuth, async (req, res) => {
  try {
    const passes = await GuestPass.find()
      .populate("requestedBy", "name userId") // Get user info
      .populate("handledBy", "adminId")
      .sort({ createdAt: -1 }); // Show newest requests first
    res.json(passes);
  } catch (err) {
    console.error("Error fetching all guest passes:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PATCH /api/guestpass/:id/approve
// @desc    Admin approves a guest pass and generates a code
// @access  Private (Admin Only)
router.patch("/:id/approve", adminAuth, async (req, res) => {
  try {
    const pass = await GuestPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({ msg: "Guest pass not found" });
    }
    if (pass.status !== "Pending") {
      return res.status(400).json({ msg: "This pass is not pending" });
    }

    // Generate unique code
    const code = `GP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    pass.status = "Approved";
    pass.code = code;
    pass.handledBy = req.admin.id;
    await pass.save();

    const updatedPass = await GuestPass.findById(pass._id)
      .populate("requestedBy", "name userId")
      .populate("handledBy", "adminId");
    res.json(updatedPass);
  } catch (err) {
    console.error("Error approving guest pass:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PATCH /api/guestpass/:id/reject
// @desc    Admin rejects a guest pass
// @access  Private (Admin Only)
router.patch("/:id/reject", adminAuth, async (req, res) => {
  try {
    const pass = await GuestPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({ msg: "Guest pass not found" });
    }
    if (pass.status !== "Pending") {
      return res.status(400).json({ msg: "This pass is not pending" });
    }

    pass.status = "Rejected";
    pass.handledBy = req.admin.id;
    await pass.save();

    const updatedPass = await GuestPass.findById(pass._id)
      .populate("requestedBy", "name userId")
      .populate("handledBy", "adminId");
    res.json(updatedPass);
  } catch (err) {
    console.error("Error rejecting guest pass:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PATCH /api/guestpass/:id/checkin
// @desc    Admin/Security records guest arrival
// @access  Private (Admin Only) - assuming admin for now
router.patch("/:id/checkin", adminAuth, async (req, res) => {
  try {
    const pass = await GuestPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({ msg: "Guest pass not found" });
    }
    if (pass.status !== "Approved") {
      return res.status(400).json({ msg: "Pass must be Approved to check in" });
    }

    pass.checkInTime = new Date();
    await pass.save();

    const updatedPass = await GuestPass.findById(pass._id)
      .populate("requestedBy", "name userId")
      .populate("handledBy", "adminId");
    res.json(updatedPass);
  } catch (err) {
    console.error("Error checking in guest:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PATCH /api/guestpass/:id/checkout
// @desc    Admin/Security records guest departure
// @access  Private (Admin Only)
router.patch("/:id/checkout", adminAuth, async (req, res) => {
  try {
    const pass = await GuestPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({ msg: "Guest pass not found" });
    }
    if (!pass.checkInTime) {
      return res.status(400).json({ msg: "Guest must check in first" });
    }

    pass.checkOutTime = new Date();
    await pass.save();

    const updatedPass = await GuestPass.findById(pass._id)
      .populate("requestedBy", "name userId")
      .populate("handledBy", "adminId");
    res.json(updatedPass);
  } catch (err) {
    console.error("Error checking out guest:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
