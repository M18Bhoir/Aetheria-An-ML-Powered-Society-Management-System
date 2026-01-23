import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// IMPORTANT: Ensure there is NO adminSchema.pre('save', ...) block here.
// If it exists, DELETE or COMMENT IT OUT.

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
