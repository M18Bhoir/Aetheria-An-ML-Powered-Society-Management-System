// my-app/backend/seed/seedData.js
import mongoose from "mongoose";
import "dotenv/config"; // Load environment variables from backend/.env
import Billing from "../models/Billing.js"; // Path corrected to point to backend/models
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import Visitor from "../models/Visitor.js";

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const categories = ["Maintenance", "Electrical", "Security", "Plumbing"];
const amenities = ["Gym", "Swimming Pool", "Club House", "Tennis Court"];

async function seedData() {
  try {
    /* ================= CONNECT ================= */
    // Use your existing DB URI or fallback to local
    const dbUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/society-management";
    await mongoose.connect(dbUri);
    console.log("✅ MongoDB connected for seeding");

    /* ================= CLEAR DATA ================= */
    console.log("🧹 Clearing old analytics data...");
    await Promise.all([
      Billing.deleteMany(),
      Complaint.deleteMany(),
      Booking.deleteMany(),
      Visitor.deleteMany(),
    ]);

    const dummyUserId = new mongoose.Types.ObjectId();

    /* ================= BILLING ================= */
    const billingData = [];
    for (let i = 0; i < 200; i++) {
      const amount = 3000;
      const paid =
        Math.random() > 0.15 ? amount : Math.floor(Math.random() * amount);

      billingData.push({
        userId: dummyUserId,
        amount,
        amountPaid: paid,
        paymentDate: randomDate(new Date("2025-01-01"), new Date("2026-02-10")),
        status: paid === amount ? "Paid" : "Pending",
      });
    }

    /* ================= COMPLAINTS ================= */
    const complaintData = [];
    for (let i = 0; i < 120; i++) {
      complaintData.push({
        userId: dummyUserId, // ✅ FIXED
        category: categories[Math.floor(Math.random() * categories.length)],
        status: Math.random() > 0.3 ? "Resolved" : "Open",
        createdAt: randomDate(new Date("2025-06-01"), new Date("2026-02-10")),
        title: "Seed Complaint",
        description: "Generated for analytics testing",
      });
    }

    /* ================= BOOKINGS ================= */
    const bookings = [];
    for (let i = 0; i < 150; i++) {
      const hour = Math.random() > 0.7 ? 18 : Math.floor(Math.random() * 22);
      const startTime = new Date(
        2026,
        1,
        Math.floor(Math.random() * 28) + 1,
        hour,
        0,
      );

      bookings.push({
        amenityName: amenities[Math.floor(Math.random() * amenities.length)],
        bookedBy: dummyUserId,
        startTime,
        endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
        status: "Approved",
      });
    }

    /* ================= VISITORS ================= */
    const visitorData = [];
    for (let i = 0; i < 300; i++) {
      const checkIn = randomDate(
        new Date("2026-01-01"),
        new Date("2026-02-11"),
      );
      visitorData.push({
        name: `Visitor ${i}`,
        checkIn,
        checkOut: new Date(checkIn.getTime() + 120 * 60000),
        purpose: "Guest",
        flatNo: "A-101",
      });
    }

    /* ================= INSERT ================= */
    await Billing.insertMany(billingData);
    await Complaint.insertMany(complaintData);
    await Booking.insertMany(bookings);
    await Visitor.insertMany(visitorData);

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedData();
