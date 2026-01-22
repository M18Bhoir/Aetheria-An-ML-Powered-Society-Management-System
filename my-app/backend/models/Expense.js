import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the expense'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  category: {
    type: String,
    enum: ['Utilities', 'Maintenance', 'Staff Salaries', 'Supplies', 'Other'],
    default: 'Other',
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  }
}, {
  timestamps: true // Adds createdAt
});

ExpenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;