import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
      status: "Open",
      // Optional: Set SLA based on priority
      slaDueAt: new Date(
        Date.now() + (priority === "P1" ? 4 : 24) * 60 * 60 * 1000,
      ),
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create ticket" });
  }
});

router.get("/user", protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load tickets" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ticket ID" });
    }
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("assignedTo", "name");

    if (!ticket) return res.status(404).json({ msg: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
