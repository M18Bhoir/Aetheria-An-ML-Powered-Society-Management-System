import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/* ===============================
   CREATE TICKET
   =============================== */
router.post("/create", protect, async (req, res) => {
  try {
    if (req.role !== "user") {
      return res.status(403).json({ msg: "Only users can create tickets" });
    }

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
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ msg: "Failed to create ticket" });
  }
});

/* ===============================
   USER: GET OWN TICKETS
   =============================== */
router.get("/user", protect, async (req, res) => {
  try {
    if (req.role !== "user") {
      return res.status(403).json({ msg: "User access only" });
    }

    const tickets = await Ticket.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Fetch user tickets error:", err);
    res.status(500).json({ msg: "Failed to load tickets" });
  }
});

/* ===============================
   USER: TICKET SUMMARY
   =============================== */
router.get("/summary", protect, async (req, res) => {
  try {
    if (req.role !== "user") {
      return res.status(403).json({ msg: "User access only" });
    }

    const userId = req.user._id;

    const summary = {
      total: await Ticket.countDocuments({ createdBy: userId }),
      open: await Ticket.countDocuments({ createdBy: userId, status: "Open" }),
      assigned: await Ticket.countDocuments({
        createdBy: userId,
        status: "Assigned",
      }),
      closed: await Ticket.countDocuments({
        createdBy: userId,
        status: "Closed",
      }),
    };

    res.json(summary);
  } catch (err) {
    console.error("Ticket summary error:", err);
    res.status(500).json({ msg: "Failed to load summary" });
  }
});

/* ===============================
   GET SINGLE TICKET (LAST!)
   =============================== */
router.get("/:id", protect, async (req, res) => {
  try {
    // 🛑 Prevent ObjectId cast crash
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name userId")
      .populate("assignedTo", "name userId");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    if (
      req.role === "user" &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Fetch single ticket error:", err);
    res.status(500).json({ msg: "Failed to load ticket" });
  }
});

export default router;
