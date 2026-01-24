import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Admin",
    },
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// 🔐 Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ REQUIRED for login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Admin", adminSchema);
