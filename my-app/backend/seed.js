import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import User from "./models/User.js";

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const residentData = [
  { name: "Manas Bhoir", userId: "A-101", phone: "+17473460345" }, // Specific number added
  { name: "Aditya Gupta", userId: "A-102" },
  { name: "Mayur Desai", userId: "A-103" },
  { name: "Sujal Daryapurkar", userId: "A-104" },
  { name: "Omkar Chandgaonkar", userId: "A-201" },
  { name: "Aaryan Ghawali", userId: "A-202" },
  { name: "Paresh Gupta", userId: "A-203" },
  { name: "Aditya Chaudhari", userId: "A-204" },
  { name: "Jitesh Kotian", userId: "A-301" },
  { name: "Shailesh Bhandari", userId: "A-302" },
  { name: "Yash Borse", userId: "A-303" },
  { name: "Swami Chougule", userId: "A-304" },
  { name: "Siddhant Gaikwad", userId: "A-401" },
  { name: "Retiesh Deshmukh", userId: "A-402" },
  { name: "Leeladhar Bhowar", userId: "A-403" },
  { name: "Kunal Auti", userId: "A-404" },
  { name: "Bhushan Ingale", userId: "B-101" },
  { name: "Ayush Kanse", userId: "B-102" },
  { name: "PushKar Karnik", userId: "B-103" },
  { name: "Sumit Kanse", userId: "B-104" },
];

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany(); // Clear old users
    console.log("Purane users delete kar diye gaye...");

    const usersToInsert = residentData.map((user, index) => {
      const dummyEmail = `${user.userId.toLowerCase().replace(/ /g, "")}@aetheria.com`;
      const defaultPassword = "Aetheria@123";

      // Generate a unique dummy phone number if one isn't provided (for unique constraint)
      // Note: Twilio requires E.164 format (e.g., +91...)
      const dummyPhone =
        user.phone || `+9190000000${index.toString().padStart(2, "0")}`;

      return {
        ...user,
        email: dummyEmail,
        password: defaultPassword,
        phone: dummyPhone, // Ensure phone is present for model validation
        role: "user",
      };
    });

    // Use .create() in a loop to ensure the pre('save') hook for hashing runs
    for (const userData of usersToInsert) {
      await User.create(userData);
    }

    console.log(
      `Successfully! Sabhi ${usersToInsert.length} residents ko add kar diya gaya hai!`,
    );
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
