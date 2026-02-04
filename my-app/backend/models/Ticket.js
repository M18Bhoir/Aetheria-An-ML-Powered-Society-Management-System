import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Maintenance", "Electrical", "Security", "Billing", "Amenities"],
      default: "Maintenance",
    },
    priority: {
      type: String,
      enum: ["P1", "P2", "P3", "P4"],
      default: "P3",
    },
    status: {
      type: String,
      enum: [
        "Open",
        "Assigned",
        "In Progress",
        "Resolved",
        "Pending Closure",
        "Closed",
      ],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    otpVerified: { type: Boolean, default: false },
    slaDueAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Ticket", ticketSchema);
