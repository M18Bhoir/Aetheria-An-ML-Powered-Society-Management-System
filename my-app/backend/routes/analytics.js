import express from "express";
import axios from "axios";
import adminAuth from "../middleware/adminAuth.js";
import Billing from "../models/Billing.js";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import Visitor from "../models/Visitor.js";

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

// ... Remaining routes (complaints, amenity-peak, visitor-trends) stay the same
export default router;
