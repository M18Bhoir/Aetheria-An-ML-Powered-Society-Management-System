import express from "express";
import Dues from "../models/Dues.js";
import User from "../models/User.js";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   📊 GENERATE MONTHLY BILLING (CAM, ELEC, WATER)
   ========================================================= */
router.post("/generate-monthly", adminAuth, async (req, res) => {
  const { month, year, camRate, electricityRate, waterRate } = req.body;

  try {
    const residents = await User.find({ role: "resident" });
    const dueDate = new Date(year, month, 10); // Due on 10th of next month

    const bills = [];

    for (const resident of residents) {
      // 1. Common Area Maintenance (CAM) - Flat rate
      bills.push({
        user: resident._id,
        type: "Maintenance",
        amount: camRate || 2500,
        dueDate,
        description: `Monthly CAM - ${month}/${year}`
      });

      // 2. Electricity (Mocking usage or using fixed part)
      const elecUsage = Math.floor(Math.random() * 200) + 100; // Mock usage
      bills.push({
        user: resident._id,
        type: "Electricity",
        amount: elecUsage * (electricityRate || 7),
        dueDate,
        description: `Electricity Bill - ${month}/${year}`,
        billingDetails: { usage: elecUsage, rate: electricityRate || 7 }
      });

      // 3. Water (Flat or Mocked)
      bills.push({
        user: resident._id,
        type: "Water",
        amount: waterRate || 500,
        dueDate,
        description: `Water Charges - ${month}/${year}`
      });
    }

    await Dues.insertMany(bills);

    res.status(201).json({ msg: `Generated ${bills.length} bills for ${residents.length} residents.` });
  } catch (err) {
    console.error("BILL GENERATION ERROR:", err);
    res.status(500).json({ msg: "Server error during bill generation" });
  }
});

/* =========================================================
   📜 RESIDENT DIGITAL LEDGER
   ========================================================= */
router.get("/my-ledger", auth, async (req, res) => {
  try {
    const ledger = await Dues.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(ledger);
  } catch (err) {
    console.error("LEDGER FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error fetching ledger" });
  }
});

/* =========================================================
   📈 TREASURER REPORTING (ADMIN)
   ========================================================= */
router.get("/admin-report", adminAuth, async (req, res) => {
  try {
    const summary = await Dues.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const collectionByType = await Dues.aggregate([
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: "$type",
          totalCollected: { $sum: "$amount" }
        }
      }
    ]);

    res.json({ summary, collectionByType });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ msg: "Server error fetching reports" });
  }
});

export default router;
