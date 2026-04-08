import express from "express";
import Ticket from "../models/Ticket.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   📊 GET SOCIETY MAP STATUS
   ========================================================= */
router.get("/status", protect, async (req, res) => {
  try {
    const now = new Date();

    // 1. Fetch Amenity Occupancy
    const activeBookings = await Booking.find({
      status: "Approved",
      startTime: { $lte: now },
      endTime: { $gte: now }
    });

    const amenityStatus = {
      "Swimming Pool": { occupied: false },
      "Gym": { occupied: false },
      "Clubhouse": { occupied: false },
      "Tennis Court": { occupied: false }
    };

    activeBookings.forEach(booking => {
      if (amenityStatus[booking.amenityName]) {
        amenityStatus[booking.amenityName] = { 
          occupied: true, 
          bookedBy: booking.bookedBy 
        };
      }
    });

    // 2. Fetch Building Wing Health (Open Tickets)
    // We'll join Ticket with User to get the Wing
    const openTickets = await Ticket.find({ 
      status: { $in: ["Open", "In Progress"] } 
    }).populate("createdBy", "wing");

    const wingStatus = {
      "A": { openTickets: 0 },
      "B": { openTickets: 0 },
      "C": { openTickets: 0 },
      "D": { openTickets: 0 }
    };

    openTickets.forEach(ticket => {
      const wing = ticket.createdBy?.wing;
      if (wing && wingStatus[wing]) {
        wingStatus[wing].openTickets += 1;
      }
    });

    res.json({
      amenities: amenityStatus,
      wings: wingStatus,
      timestamp: now
    });
  } catch (err) {
    console.error("MAP STATUS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
