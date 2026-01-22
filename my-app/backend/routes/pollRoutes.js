import express from 'express';
import Poll from '../models/Poll.js';
import protect from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; 

const router = express.Router();

// @route   POST /
// @desc    Admin creates a poll
// @access  Private (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const poll = await Poll.create({ ...req.body, createdBy: req.admin.id });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /
// @desc    Get all polls (for users)
// @access  Private (User)
router.get('/', protect, async (req, res) => {
  try {
    const polls = await Poll.find().populate('createdBy', 'name userId');
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /:id
// @desc    Get a single poll by ID (for users)
// @access  Private (User)
router.get('/:id', protect, async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).populate('createdBy', 'name userId');
        if (!poll) {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        res.json(poll);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /vote/:pollId
// @desc    Vote on a poll (User Only)
// @access  Private (User)
router.post('/vote/:pollId', protect, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }
    const { optionIndex } = req.body;
    if (optionIndex === null || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ msg: 'Invalid option selected.' });
    }
    poll.options[optionIndex].votes += 1;
    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /:id
// @desc    Delete a poll (Admin Only)
// @access  Private (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        await poll.deleteOne();
        res.json({ msg: 'Poll removed successfully' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});


// --- 1. NEW ROUTES FOR ADMINS ---

// @route   GET /api/polls/admin/all
// @desc    Get all polls (for Admin)
// @access  Private (Admin Only)
router.get('/admin/all', adminAuth, async (req, res) => {
    try {
        const polls = await Poll.find().populate('createdBy', 'name userId');
        res.json(polls);
    } catch (err) {
        console.error('Error fetching polls for admin:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/polls/admin/:id
// @desc    Get a single poll by ID (for Admin)
// @access  Private (Admin Only)
router.get('/admin/:id', adminAuth, async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).populate('createdBy', 'name userId');
        if (!poll) {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        res.json(poll);
    } catch (err) {
        console.error('Error fetching poll for admin:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Poll not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});


export default router;