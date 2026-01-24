import express from "express";
import Ticket from "../models/Ticket.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* ================= 📊 TICKET OVERVIEW ================= */
router.get("/tickets/overview", adminAuth, async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: "Open" });
    const assigned = await Ticket.countDocuments({ status: "Assigned" });
    const closed = await Ticket.countDocuments({ status: "Closed" });

    res.json({ total, open, assigned, closed });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load ticket overview" });
  }
});

/* ================= 📋 ALL TICKETS ================= */
router.get("/tickets", adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

/* ================= 🎯 ASSIGN TICKET ================= */
router.patch("/tickets/:id/assign", adminAuth, async (req, res) => {
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return res.status(400).json({ msg: "Assigned person is required" });
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    ticket.assignedTo = assignedTo;
    ticket.status = "Assigned";

    await ticket.save();

    res.json({ msg: "Ticket assigned successfully", ticket });
  } catch (err) {
    res.status(500).json({ msg: "Failed to assign ticket" });
  }
});

/* ================= ⏰ SLA ALERTS ================= */
router.get("/tickets/sla-alerts", adminAuth, async (req, res) => {
  try {
    const now = new Date();

    const breachedTickets = await Ticket.find({
      status: { $ne: "Closed" },
      slaDueAt: { $lt: now },
    }).populate("createdBy", "name");

    res.json(breachedTickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load SLA alerts" });
  }
});

export default router;
