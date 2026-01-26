import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

/* ================= PATH SETUP ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= ENV CHECK ================= */
console.log("Checking Environment Variables...");
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID || "Not Set");

/* ================= DB CONNECTION ================= */
import connectDB from "./config/db.js";

/* ================= ROUTE IMPORTS ================= */
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminTicketRoutes from "./routes/adminTicketRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import guestPassRoutes from "./routes/guestPassRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import mlRoutes from "./routes/mlroutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import analyticsRoutes from "./routes/analytics.js"; // ✅ Added missing analytics import

/* ================= MIDDLEWARE ================= */
import protect from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= CONNECT DB ================= */
connectDB();

/* ================= GLOBAL MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
// Serves uploaded images for marketplace and user profiles
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminTicketRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/guestpass", guestPassRoutes);
app.use("/api/upload", protect, uploadRoutes);
app.use("/api/payment", protect, paymentRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes); // ✅ Mounted analytics routes

/* ================= TEST ROUTE ================= */
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend working!" });
});

/* ================= SERVE FRONTEND ================= */
// Pointing to the production build of the React app
app.use(express.static(path.join(__dirname, "../dist")));

/* ================= SPA FALLBACK ================= */
// Ensures that direct URL access to frontend routes works (Single Page Application)
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api/") &&
    !req.path.startsWith("/uploads/")
  ) {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  } else {
    next();
  }
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
