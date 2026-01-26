import mongoose from "mongoose";
import Billing from "../models/Billing.js";
import Complaint from "../models/Complaint.js";
import Booking from "../models/Booking.js";
import Visitor from "../models/Visitor.js";

mongoose.connect("mongodb://127.0.0.1:27017/societyDB");
console.log("✅ MongoDB connected");

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const categories = ["Maintenance", "Electrical", "Security", "Billing"];
const amenities = ["Gym", "Swimming Pool", "Club House"];

async function seedData() {
  try {
    await Billing.deleteMany();
    await Complaint.deleteMany();
    await Booking.deleteMany();
    await Visitor.deleteMany();
    await mongoose.connect("mongodb://127.0.0.1:27017/societyDB");
    console.log("✅ MongoDB connected");

    const dummyUserId = new mongoose.Types.ObjectId();

    /* ================= BILLING ================= */
    const billingData = [];
    for (let i = 0; i < 200; i++) {
      const amount = 3000;
      const paid = Math.random() > 0.2 ? amount : amount - 500;

      billingData.push({
        userId: new mongoose.Types.ObjectId(),
        amount,
        amountPaid: paid,
        paymentDate: randomDate(new Date("2024-01-01"), new Date("2025-01-31")),
      });
    }

    /* ================= COMPLAINTS ================= */
    const complaintData = [];
    for (let i = 0; i < 120; i++) {
      complaintData.push({
        userId: new mongoose.Types.ObjectId(),
        category: categories[Math.floor(Math.random() * categories.length)],
        status: Math.random() > 0.3 ? "Resolved" : "Open",
        createdAt: randomDate(new Date("2024-06-01"), new Date("2025-01-31")),
      });
    }

    /* ================= BOOKINGS ================= */
    const bookings = [];

    for (let i = 0; i < 150; i++) {
      const startTime = new Date(
        2025,
        Math.floor(Math.random() * 2), // Jan–Feb
        Math.floor(Math.random() * 28) + 1,
        Math.random() > 0.6 ? 18 : Math.floor(Math.random() * 22),
      );

      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      bookings.push({
        amenityName: amenities[Math.floor(Math.random() * amenities.length)],
        bookedBy: dummyUserId,
        startTime,
        endTime,
      });
    }

    /* ================= INSERT ================= */
    await Booking.deleteMany();
    await Booking.insertMany(bookings);

    console.log("✅ Booking data seeded successfully");
    process.exit();

    /* ================= VISITORS ================= */
    const visitorData = [];
    for (let i = 0; i < 300; i++) {
      const checkIn = randomDate(
        new Date("2025-01-01"),
        new Date("2025-01-31"),
      );

      visitorData.push({
        name: "Visitor",
        checkIn,
        checkOut: new Date(checkIn.getTime() + 30 * 60000),
      });
    }

    await Billing.insertMany(billingData);
    await Complaint.insertMany(complaintData);
    await Booking.insertMany(bookingData);
    await Visitor.insertMany(visitorData);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
