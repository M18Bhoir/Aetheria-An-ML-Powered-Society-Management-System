import mongoose from 'mongoose';

const RentalApplicationSchema = new mongoose.Schema({
  resident: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tenantName: {
    type: String,
    required: true
  },
  tenantEmail: {
    type: String,
    required: true
  },
  tenantPhone: {
    type: String,
    required: true
  },
  moveInDate: {
    type: Date,
    required: true
  },
  moveOutDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  adminNotes: {
    type: String
  }
}, { timestamps: true });

const Rental = mongoose.model('Rental', RentalApplicationSchema);
export default Rental;