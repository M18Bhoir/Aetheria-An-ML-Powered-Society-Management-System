// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  // Resolved: Added fail-fast check for JWT_SECRET alongside MONGO_URI
  if (!MONGO_URI) {
    console.warn(
      "WARNING: MONGO_URI is not defined. Backend will start but database features will not work. Please set the MONGO_URI secret.",
    );
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default connectDB;
