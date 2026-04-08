import mongoose from 'mongoose';

const DuesSchema = new mongoose.Schema({
  // Link to the user who owes the due
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Type of due (e.g., maintenance, event, penalty)
  type: {
    type: String,
    required: [true, 'Please provide a due type'],
    default: 'Maintenance',
    trim: true
  },
  amount: { 
    type: Number, 
    required: [true, 'Please provide an amount']
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Overdue'], 
    default: 'Pending' 
  },
  // Date the user actually paid
  paidOn: { 
    type: Date 
  },
  // Optional notes from admin
  notes: {
    type: String,
    trim: true
  },
  // Detailed description for ledger
  description: {
    type: String,
    trim: true
  },
  // Details for automated billing (e.g. meter readings)
  billingDetails: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true }); // timestamps adds createdAt and updatedAt

// Add an index to quickly find all dues for a specific user
DuesSchema.index({ user: 1, status: 1 });

const Dues = mongoose.model('Dues', DuesSchema);
export default Dues;