import mongoose from 'mongoose';

const GuestPassSchema = new mongoose.Schema({
  requestedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    trim: true,
    default: 'Personal Visit'
  },
  code: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents to have no code until approved
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Expired'],
    default: 'Pending'
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

GuestPassSchema.index({ requestedBy: 1, status: 1 });

const GuestPass = mongoose.model('GuestPass', GuestPassSchema);
export default GuestPass;