import mongoose from "mongoose";

const nocRequestSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["Renovation", "Move In", "Move Out"],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending"
  },
  adminComments: {
    type: String,
    trim: true
  },
  workers: [{
    name: String,
    phone: String,
    code: String // Generated upon approval
  }],
  documents: [{
    type: String // URLs or Filenames
  }],
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }
}, { timestamps: true });

// Ensure end date is not before start date
nocRequestSchema.path('endDate').validate(function(value) {
  return value >= this.startDate;
}, 'End date cannot be before start date.');

export default mongoose.model("NOCRequest", nocRequestSchema);
