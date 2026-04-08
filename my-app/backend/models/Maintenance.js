import mongoose from 'mongoose';

const MaintenanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the task'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  category: {
    type: String,
    enum: ["Plumbing", "Electrical", "Security", "Cleanliness", "Common Area", "Other"],
    default: "Other"
  },
  urgency: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index to get newest tasks first
MaintenanceSchema.index({ scheduledDate: -1 });

const Maintenance = mongoose.model('Maintenance', MaintenanceSchema);
export default Maintenance;