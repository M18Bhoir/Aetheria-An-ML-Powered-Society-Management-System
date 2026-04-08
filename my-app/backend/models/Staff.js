import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Maid", "Cook", "Driver", "Security", "Delivery", "Other"],
    required: true 
  },
  resident: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Revoked"], 
    default: "Pending" 
  },
  entryStats: [{
    enteredAt: Date,
    exitedAt: Date
  }]
}, { timestamps: true });

export default mongoose.model("Staff", staffSchema);
