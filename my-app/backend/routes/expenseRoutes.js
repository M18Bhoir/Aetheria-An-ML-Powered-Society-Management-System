import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// @route   POST /api/expenses
// @desc    Admin logs a new expense
// @access  Private (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({ msg: 'Please provide title, amount, category, and date.' });
  }

  try {
    const newExpense = new Expense({
      title,
      amount: Number(amount),
      category,
      description,
      date: new Date(date),
      createdBy: req.admin.id 
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error('Error creating expense:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/expenses
// @desc    Admin gets all expenses
// @access  Private (Admin Only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;