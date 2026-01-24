import express from "express";
import Ticket from "../models/Ticket.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/* ===============================
   CREATE TICKET
   =============================== */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const ticket = new Ticket({
      title,
      description,
      category,
      priority,
      createdBy: req.user.id,
      status: "Open",
    });

    await ticket.save();

    // ✅ SEND RESPONSE ONCE
    return res.status(201).json(ticket);
  } catch (err) {
    console.error("Create ticket error:", err.message);
    return res.status(500).json({ msg: "Failed to create ticket" });
  }
});

/* ===============================
   GET LOGGED-IN USER TICKETS
   =============================== */
router.get("/my", protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json(tickets);
  } catch (err) {
    console.error("Fetch tickets error:", err.message);
    return res.status(500).json({ msg: "Failed to fetch tickets" });
  }
});

export default router;
