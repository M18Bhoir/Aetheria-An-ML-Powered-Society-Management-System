import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Delete existing admins
    await Admin.deleteMany();
    console.log("🧹 Cleared existing admins");

    // Create default admin
    const admin = await Admin.create({
      name: "System Admin",
      adminId: "ADMIN-001",
      email: "admin@aetheria.com",
      password: "Admin@123", // Default password - change in production
    });

    console.log("✅ Admin created successfully");
    console.log("📋 Admin Credentials:");
    console.log("   Admin ID: ADMIN-001");
    console.log("   Password: Admin@123");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
