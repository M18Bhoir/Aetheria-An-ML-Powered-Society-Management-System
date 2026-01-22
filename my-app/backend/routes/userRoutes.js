import express from 'express';
import protect from '../middleware/auth.js';
import User from '../models/User.js';
import Dues from '../models/Dues.js'; // <-- Import the new Dues model

const router = express.Router();

// Get logged in user profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/user/dues
// @desc    Get current user's most recent outstanding due
// @access  Private
router.get('/dues', protect, async (req, res) => {
  try {
    // Find the most recent due for the logged-in user (req.user.id)
    // that is either 'Pending' or 'Overdue'.
    const latestDue = await Dues.findOne({ 
      user: req.user.id,
      status: { $in: ['Pending', 'Overdue'] } 
    })
    .sort({ dueDate: 1 }); // Sort by dueDate ascending to get the *next* one due

    if (!latestDue) {
      // --- UPDATED: Return a 'Paid' status with 0 amount ---
      return res.json({ 
        dues: { 
          amount: 0, 
          status: 'Paid', 
          dueDate: null 
        } 
      });
    }

    // The frontend (User_Dashboard.jsx) expects { dues: ... }
    res.json({ dues: latestDue });

  } catch (err) {
    console.error('Error fetching user dues:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;