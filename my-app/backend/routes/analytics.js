// routes/analytics.js
router.get("/maintenance-collection", adminAuth, async (req, res) => {
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
        month: "$_id",
        collectionRate: {
          $multiply: [{ $divide: ["$totalCollected", "$totalDue"] }, 100],
        },
      },
    },
  ]);

  res.json(data);
});

router.get("/complaints-by-category", adminAuth, async (req, res) => {
  const data = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json(data);
});

router.get("/amenity-peak-hours", adminAuth, async (req, res) => {
  const data = await Booking.aggregate([
    {
      $group: {
        _id: { $hour: "$startTime" },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { bookings: -1 } },
  ]);

  res.json(data);
});

router.get("/visitor-trends", adminAuth, async (req, res) => {
  const data = await Visitor.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkIn" } },
        visitors: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
});
