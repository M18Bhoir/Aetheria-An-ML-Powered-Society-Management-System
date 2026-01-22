import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import Maintenance from '../models/Maintenance.js';

const router = express.Router();

// @route   POST /api/maintenance
// @desc    Admin creates a new maintenance task
// @access  Private (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  const { title, description, scheduledDate, status } = req.body;

  if (!title || !scheduledDate) {
    return res.status(400).json({ msg: 'Please provide a title and scheduled date.' });
  }

  try {
    const newTask = new Maintenance({
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      status: status || 'Pending',
      createdBy: req.admin.id 
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Error creating maintenance task:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/maintenance
// @desc    Admin gets all maintenance tasks
// @access  Private (Admin Only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const tasks = await Maintenance.find().sort({ scheduledDate: -1 });
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching maintenance tasks:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PATCH /api/maintenance/:id/status
// @desc    Admin updates a task's status
// @access  Private (Admin Only)
router.patch('/:id/status', adminAuth, async (req, res) => {
    const { status } = req.body;
    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        const task = await Maintenance.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task.status = status;
        await task.save();
        res.json(task);
    } catch (err) {
        console.error('Error updating task status:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;