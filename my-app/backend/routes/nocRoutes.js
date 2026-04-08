import express from "express";
import NOCRequest from "../models/NOCRequest.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * 📝 POST /api/noc/request
 * Resident submits a new NOC request
 */
router.post("/request", auth, async (req, res) => {
  const { type, description, startDate, endDate, workers, documents } = req.body;

  if (!type || !description || !startDate || !endDate) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const newRequest = await NOCRequest.create({
      resident: req.user.id,
      type,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      workers: workers || [],
      documents: documents || []
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("NOC CREATE ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * 📋 GET /api/noc/my
 * Resident views their own NOC requests
 */
router.get("/my", auth, async (req, res) => {
  try {
    const requests = await NOCRequest.find({ resident: req.user.id })
      .populate("resident", "name userId flat")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("NOC FETCH ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * 🛡️ GET /api/noc/admin/all
 * Committee views all NOC requests
 */
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const requests = await NOCRequest.find()
      .populate("resident", "name userId flat")
      .populate("handledBy", "name")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("ADMIN NOC FETCH ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * ✅ PATCH /api/noc/admin/:id/respond
 * Committee approves or rejects NOC
 * Approving generates temporary worker codes
 */
router.patch("/admin/:id/respond", adminAuth, async (req, res) => {
  const { status, adminComments } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status response" });
  }

  try {
    const request = await NOCRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "NOC request not found" });

    request.status = status;
    request.adminComments = adminComments;
    request.handledBy = req.admin.id;

    if (status === "Approved") {
      // Generate unique codes for each worker
      request.workers = request.workers.map(worker => ({
        ...worker,
        code: `NW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      }));
    }

    await request.save();
    res.json(request);
  } catch (err) {
    console.error("NOC RESPOND ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
