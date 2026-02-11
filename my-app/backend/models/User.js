import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    // 📱 Add phone field for Twilio OTP
    phone: {
      type: String,
      required: [true, "Phone number is required for OTP verification"],
      unique: true,
      default: "", // Stores +918652718080
      role: { type: String, enum: ["resident", "admin"], default: "resident" },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ REQUIRED for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
