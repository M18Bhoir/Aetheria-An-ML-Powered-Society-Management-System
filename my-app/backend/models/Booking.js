import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  amenityName: {
    type: String,
    required: [true, 'Please specify the amenity name'],
    trim: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  eventDescription: {
    type: String,
    trim: true,
    default: 'General Booking'
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start date and time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end date and time'],
    validate: [
      function(value) {
        return this.startTime < value; // Ensures logic consistency
      },
      'End time must be after start time'
    ]
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true 
});

BookingSchema.index({ amenityName: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;