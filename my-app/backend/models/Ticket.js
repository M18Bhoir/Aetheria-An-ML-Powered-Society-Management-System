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
    status: {
      type: String,
      enum: ["Open", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: { type: String, default: null },
    // OTP fields for closing the ticket
    otp: { type: String },
    otpExpiresAt: { type: Date },
    otpVerified: { type: Boolean, default: false },
    closedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Ticket", ticketSchema);
