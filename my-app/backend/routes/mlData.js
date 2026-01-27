// routes/mlData.js
import express from "express";
import Billing from "../models/Billing.js";

const router = express.Router();

router.get("/ml/maintenance", async (req, res) => {
  try {
    const data = await Billing.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$paymentDate",
            },
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
            $multiply: [{ $divide: ["$totalCollected", "$totalDue"] }, 100],
          },
        },
      },
      { $sort: { ds: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "ML data fetch failed" });
  }
});

export default router;
