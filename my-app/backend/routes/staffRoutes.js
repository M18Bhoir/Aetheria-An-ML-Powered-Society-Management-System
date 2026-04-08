import express from "express";
import Staff from "../models/Staff.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* =========================================================
   📜 GET ALL STAFF FOR RESIDENT
   ========================================================= */
router.get("/my-staff", auth, async (req, res) => {
  try {
    const staff = await Staff.find({ resident: req.user.id });
    res.json(staff);
  } catch (err) {
    console.error("STAFF FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   ➕ REGISTER STAFF
   ========================================================= */
router.post("/register", auth, async (req, res) => {
  const { name, phone, type } = req.body;

  if (!name || !phone || !type) {
    return res.status(400).json({ msg: "Name, phone, and type required" });
  }

  try {
    const newStaff = await Staff.create({
      name,
      phone,
      type,
      resident: req.user.id
    });

    res.status(201).json(newStaff);
  } catch (err) {
    console.error("STAFF CREATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   🛡️ ADMIN: GET ALL STAFF & UPDATE STATUS
   ========================================================= */
router.get("/admin/all", adminAuth, async (req, res) => {
  try {
    const staff = await Staff.find().populate("resident", "name userId");
    res.json(staff);
  } catch (err) {
    console.error("ADMIN STAFF FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.patch("/admin/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Revoked"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ msg: "Staff not found" });

    staff.status = status;
    await staff.save();

    res.json(staff);
  } catch (err) {
    console.error("STAFF UPDATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================================================
   🕒 TRACK ENTRY / EXIT (Mock for security gate)
   ========================================================= */
router.post("/:id/track", adminAuth, async (req, res) => {
  const { action } = req.body; // "entry" or "exit"

  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ msg: "Staff not found" });

    if (action === "entry") {
      staff.entryStats.push({ enteredAt: new Date() });
    } else if (action === "exit") {
      const lastEntry = staff.entryStats[staff.entryStats.length - 1];
      if (lastEntry && !lastEntry.exitedAt) {
        lastEntry.exitedAt = new Date();
      } else {
        return res.status(400).json({ msg: "No active entry found" });
      }
    }

    await staff.save();
    res.json(staff);
  } catch (err) {
    console.error("STAFF TRACK ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
