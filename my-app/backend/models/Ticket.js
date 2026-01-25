import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

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
      enum: ["Open", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: String, // staff name or ID
      default: null,
    },

    slaHours: {
      type: Number,
      default: 72,
    },

    slaDueAt: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
    },

    closedAt: {
      type: Date,
    },

    // 🔐 OTP fields
    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* 🔥 SLA auto-calculation */
ticketSchema.pre("save", function (next) {
  if (!this.slaDueAt && this.createdAt) {
    this.slaDueAt = new Date(
      this.createdAt.getTime() + this.slaHours * 60 * 60 * 1000,
    );
  }
  next();
});

export default mongoose.model("Ticket", ticketSchema);
