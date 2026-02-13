import express from "express";
import axios from "axios";
import adminAuth from "../middleware/adminAuth.js";
import Billing from "../models/Billing.js";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import Visitor from "../models/Visitor.js";
import mongoose from "mongoose";

const router = express.Router();

/* =========================================================
   🔁 INTERNAL HELPER - MAINTENANCE HISTORY
========================================================= */
const getMaintenanceHistory = async () => {
  return await Billing.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$paymentDate" } },
        totalCollected: { $sum: "$amountPaid" },
        totalDue: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        ds: "$_id",
        y: {
          $cond: [
            { $eq: ["$totalDue", 0] },
            0,
            { $multiply: [{ $divide: ["$totalCollected", "$totalDue"] }, 100] },
          ],
        },
      },
    },
    { $sort: { ds: 1 } },
  ]);
};

/* =========================================================
   🤖 MAINTENANCE PREDICTION
========================================================= */
router.get("/maintenance-prediction", async (req, res) => {
  try {
    const historyData = await getMaintenanceHistory();

    const prediction = await axios.post(
      "http://localhost:8000/predict-maintenance",
      historyData,
    );

    res.json({
      actual: historyData,
      predicted: prediction.data,
    });
  } catch (error) {
    console.error("Prophet prediction error:", error.message);
    res.status(500).json({ message: "Maintenance prediction failed" });
  }
});

/* =========================================================
   📊 MAINTENANCE COLLECTION STATS
========================================================= */
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

/* =========================================================
   ⚙️ EQUIPMENT FAILURE PREDICTION
========================================================= */
router.get("/equipment-failure-prediction", adminAuth, async (req, res) => {
  try {
    const rawData = await mongoose.connection.db
      .collection("equipment_failure")
      .find({})
      .sort({ _id: 1 }) // chronological order
      .limit(30)
      .toArray();

    if (rawData.length === 0) {
      return res.status(404).json({ message: "No equipment data found" });
    }

    const formattedData = rawData.map((item, index) => ({
      ds: new Date(
        Date.now() - (rawData.length - index) * 86400000,
      ).toISOString(),
      y: Number(item.vibration_level ?? 0),
      temperature_avg: Number(item.temperature_avg ?? 0),
      equipment_age_days: Number(item.equipment_age_days ?? 0),
    }));

    console.log("Sending to ML service:", formattedData);

    const prediction = await axios.post(
      "http://localhost:8000/predict-equipment-failure",
      formattedData,
    );

    res.json(prediction.data);
  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    res.status(500).json({ message: "Equipment failure prediction failed" });
  }
});

/* =========================================================
   📊 OTHER ANALYTICS ROUTES
========================================================= */
router.get("/complaints-by-category", adminAuth, async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
    ]);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch complaint analytics" });
  }
});

router.get("/amenity-peak-hours", adminAuth, async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: { $hour: "$startTime" }, bookings: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, hour: "$_id", bookings: 1 } },
    ]);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch amenity analytics" });
  }
});

router.get("/visitor-trends", adminAuth, async (req, res) => {
  try {
    const data = await Visitor.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkIn" } },
          visitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", visitors: 1 } },
    ]);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch visitor analytics" });
  }
});

export default router;
