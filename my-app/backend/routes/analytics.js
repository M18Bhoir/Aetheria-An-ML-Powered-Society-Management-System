import express from "express";
import axios from "axios";
import adminAuth from "../middleware/adminAuth.js";
import Billing from "../models/Billing.js";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import Visitor from "../models/Visitor.js";

const router = express.Router();

/* ============================
   📊 Maintenance Collection
   ============================ */
router.get("/maintenance-collection", adminAuth, async (req, res) => {
  try {
    const data = await Billing.aggregate([
      {
        $group: {
          _id: { $month: "$paymentDate" },
          totalCollected: { $sum: "$amountPaid" },
          totalDue: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          collectionRate: {
            $cond: [
              { $eq: ["$totalDue", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$totalCollected", "$totalDue"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch maintenance analytics" });
  }
});

/* ============================
   🤖 Maintenance Prediction (ML)
   ============================ */
router.get("/maintenance-prediction", async (req, res) => {
  try {
    // 1️⃣ Get ML-ready data from MongoDB
    const history = await axios.get("http://localhost:5000/api/ml/maintenance");

    // 2️⃣ Send data to Prophet service
    const prediction = await axios.post(
      "http://localhost:8000/predict-maintenance",
      history.data,
    );

    res.json({
      actual: history.data,
      predicted: prediction.data,
    });
  } catch (error) {
    console.error("Prophet prediction error:", error.message);
    res.status(500).json({ message: "Prophet prediction failed" });
  }
});

/* ============================
   📊 Complaints by Category
   ============================ */
router.get("/complaints-by-category", adminAuth, async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaint analytics" });
  }
});

/* ============================
   📊 Amenity Peak Hours
   ============================ */
router.get("/amenity-peak-hours", adminAuth, async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $group: {
          _id: { $hour: "$startTime" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          bookings: 1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch amenity analytics" });
  }
});

/* ============================
   📊 Visitor Trends
   ============================ */
router.get("/visitor-trends", adminAuth, async (req, res) => {
  try {
    const data = await Visitor.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$checkIn",
            },
          },
          visitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          visitors: 1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch visitor analytics" });
  }
});

export default router;
