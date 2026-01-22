import express from 'express';
import protect from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import Notice from '../models/Notice.js';

const router = express.Router();

// @route   POST /api/notices
// @desc    Admin creates a new notice
// @access  Private (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ msg: 'Please provide a title and body.' });
  }

  try {
    const newNotice = new Notice({
      title,
      body,
      createdBy: req.admin.id // From adminAuth middleware
    });

    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (err) {
    console.error('Error creating notice:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/notices/admin
// @desc    Get all notices (for Admin)
// @access  Private (Admin Only)
router.get('/admin', adminAuth, async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (err) {
        console.error('Error fetching notices for admin:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/notices/user
// @desc    Get all notices (for Resident)
// @access  Private (User Only)
router.get('/user', protect, async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (err) {
        console.error('Error fetching notices for user:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;