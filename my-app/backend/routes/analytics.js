import express from "express";
import axios from "axios";
import adminAuth from "../middleware/adminAuth.js";
import Billing from "../models/Billing.js";

const router = express.Router();

// Internal helper to get ML-ready data without circular HTTP calls
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

/* ============================
   🤖 Maintenance Prediction (ML)
   ============================ */
router.get("/maintenance-prediction", async (req, res) => {
  try {
    // 1️⃣ Fetch data directly from DB instead of calling localhost:5000
    const historyData = await getMaintenanceHistory();

    // 2️⃣ Send data to the standalone FastAPI Prophet service (running on port 8000)
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
    res.status(500).json({ message: "Prophet prediction failed" });
  }
});

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

router.get("/equipment-failure-prediction", adminAuth, async (req, res) => {
  try {
    // 1. Fetch sensor historical logs (Vibration, Temp, etc.)
    const logs = await Maintenance.find({ type: "Sensor_Log" }).sort({
      date: 1,
    });
    const formattedData = logs.map((log) => ({ ds: log.date, y: log.value }));

    // 2. Call ML Service
    const prediction = await axios.post(
      "http://localhost:8000/predict-equipment-failure",
      formattedData,
    );

    res.json(prediction.data);
  } catch (error) {
    res.status(500).json({ message: "Failure prediction failed" });
  }
});

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

/**
 * @route   GET /api/analytics/amenity-peak-hours
 * @desc    Get booking counts grouped by hour to identify peak usage times
 * @access  Private (Admin)
 */
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

/**
 * @route   GET /api/analytics/visitor-trends
 * @desc    Get daily visitor counts to track society entry trends
 * @access  Private (Admin)
 */
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
