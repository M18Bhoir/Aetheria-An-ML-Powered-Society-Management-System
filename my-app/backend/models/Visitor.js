import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: String,
    flatNo: String,
    purpose: {
      type: String,
      enum: ["Delivery", "Guest", "Service", "Maintenance"],
    },
    checkIn: Date,
    checkOut: Date,
  },
  { timestamps: true },
);

visitorSchema.index({ checkIn: 1, checkOut: 1 });

export default mongoose.model("Visitor", visitorSchema);
