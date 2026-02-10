import express from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import protect from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

const AVAILABLE_AMENITIES = [
  { id: "clubhouse", name: "Clubhouse" },
  { id: "pool", name: "Swimming Pool Area" },
  { id: "gym", name: "Gymnasium" },
  { id: "tennis", name: "Tennis Court" },
];

// --- USER ROUTES ---
router.get("/amenities", protect, (req, res) => {
  res.json(AVAILABLE_AMENITIES);
});

router.get("/my", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ bookedBy: userId }).sort({
      startTime: -1,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching your bookings" });
  }
});

router.post("/", protect, async (req, res) => {
  const { amenityName, eventDescription, startTime, endTime } = req.body;
  const userId = req.user.id;

  try {
    const newBooking = new Booking({
      amenityName,
      bookedBy: userId,
      eventDescription,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: "Pending",
    });
    await newBooking.save();
    const populated = await Booking.findById(newBooking._id).populate(
      "bookedBy",
      "name userId",
    );
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error creating booking" });
  }
});

// --- ADMIN ROUTES ---

// GET /api/bookings/all -> Fetches EVERY user's booking for the admin dashboard
router.get("/all", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bookedBy", "name userId")
      .sort({ startTime: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/bookings/:id/status -> Admin approves or rejects a booking
router.put("/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(req.params.id).populate(
      "bookedBy",
      "name userId",
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/bookings/:id -> Admin removes a booking from the queue entirely
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ message: "Booking removed from queue", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
