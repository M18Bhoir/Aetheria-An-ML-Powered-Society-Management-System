// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  // Resolved: Added fail-fast check for JWT_SECRET alongside MONGO_URI
  if (!MONGO_URI || !process.env.JWT_SECRET) {
    console.error(
      "FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
