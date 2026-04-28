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
   🚀 ML CACHE MEMORY LAYER (TTL: 24 Hours)
========================================================= */
const mlCache = {
  maintenance: { data: null, timestamp: 0 },
  equipmentFailure: { data: null, timestamp: 0 }
};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/* =========================================================
   🔁 INTERNAL HELPER - MAINTENANCE HISTORY
========================================================= */
const getMaintenanceHistory = async () => {
  return await Billing.aggregate([
    {
      // Ensure we only process records with a valid paymentDate
      $match: {
        paymentDate: { $ne: null, $exists: true }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: { $toDate: "$paymentDate" } // Cast to date in case it's a string
          }
        },
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

    // If no history data, provide mock trend for UI demonstration
    if (!historyData || historyData.length < 2) {
       return res.json({
         actual: [],
         predicted: [
           { ds: new Date().toISOString().slice(0, 7), yhat: 85 },
           { ds: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 7), yhat: 88 }
         ]
       });
    }

    // 1. Check Cache First
    if (mlCache.maintenance.data && (Date.now() - mlCache.maintenance.timestamp) < CACHE_TTL) {
      return res.json(mlCache.maintenance.data);
    }

    // 2. No valid cache, compute from Python ML service
    const mlBaseUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const prediction = await axios.post(
      `${mlBaseUrl}/predict-maintenance`,
      historyData,
    );

    const responseData = {
      actual: historyData,
      predicted: prediction.data,
    };

    // 3. Save to cache
    mlCache.maintenance.data = responseData;
    mlCache.maintenance.timestamp = Date.now();

    res.json(responseData);
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
        $match: { paymentDate: { $ne: null } }
      },
      {
        $group: {
          _id: { $month: { $toDate: "$paymentDate" } },
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

    // If no data, provide a sensible mock prediction for the dashboard to render
    if (rawData.length < 2) {
      const mockDates = Array.from({ length: 7 }, (_, i) => ({
        ds: new Date(Date.now() + i * 86400000).toISOString(),
        yhat: 20 + Math.random() * 10,
        failure_risk: false
      }));
      return res.json(mockDates);
    }

    const formattedData = rawData.map((item, index) => ({
      ds: new Date(
        Date.now() - (rawData.length - index) * 86400000,
      ).toISOString(),
      y: Number(item.vibration_level ?? 20), // Fallback to normal level
      temperature_avg: Number(item.temperature_avg ?? 30),
      equipment_age_days: Number(item.equipment_age_days ?? 100),
    }));

    // 1. Check Cache First
    if (mlCache.equipmentFailure.data && (Date.now() - mlCache.equipmentFailure.timestamp) < CACHE_TTL) {
      return res.json(mlCache.equipmentFailure.data);
    }

    // 2. Fetch fresh prediction
    const mlBaseUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    const prediction = await axios.post(
      `${mlBaseUrl}/predict-equipment-failure`,
      formattedData,
    );

    // 3. Save to cache
    mlCache.equipmentFailure.data = prediction.data;
    mlCache.equipmentFailure.timestamp = Date.now();

    res.json(prediction.data);
  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    // Generic fallback for UI
    res.json([
      { ds: new Date().toISOString(), yhat: 25, failure_risk: false }
    ]);
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
