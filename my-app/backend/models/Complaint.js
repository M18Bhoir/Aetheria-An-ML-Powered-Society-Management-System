import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Maintenance",
        "Electrical",
        "Security",
        "Billing",
        "Amenities",
        "Plumbing",
      ],
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Complaint", complaintSchema);
