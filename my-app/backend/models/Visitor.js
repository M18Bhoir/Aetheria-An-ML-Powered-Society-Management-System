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

export default mongoose.model("Visitor", visitorSchema);
