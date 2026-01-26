// routes/mlData.js
router.get("/ml/maintenance", async (req, res) => {
  const data = await Billing.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$paymentDate" },
        },
        totalCollected: { $sum: "$amountPaid" },
        totalDue: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        collectionRate: {
          $multiply: [{ $divide: ["$totalCollected", "$totalDue"] }, 100],
        },
      },
    },
    { $sort: { month: 1 } },
  ]);

  res.json(data);
});
