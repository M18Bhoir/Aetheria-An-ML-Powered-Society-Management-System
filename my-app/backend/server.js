import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

/* ================= PATH SETUP ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= ENV CHECK ================= */
console.log("🔍 Checking Environment Variables...");
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
console.log("✅ JWT_SECRET loaded");
console.log(
  "RAZORPAY_KEY_ID =",
  process.env.RAZORPAY_KEY_ID ? "Loaded" : "Not Set",
);

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
import analyticsRoutes from "./routes/analytics.js";
import mlDataRoutes from "./routes/mlData.js";

/* ================= AUTH MIDDLEWARE ================= */
import protect from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= CONNECT DB ================= */
connectDB();

/* ================= GLOBAL MIDDLEWARE ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev
      "http://localhost:3000", // CRA (if any)
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/* ================= PUBLIC API ROUTES ================= */
app.use("/api/auth", authRoutes);

/* ================= PROTECTED API ROUTES ================= */
// 🔒 Everything below REQUIRES authentication
app.use("/api/admin", protect, adminRoutes);
app.use("/api/admin", protect, adminTicketRoutes);
app.use("/api/user", protect, userRoutes);
app.use("/api/bookings", protect, bookingRoutes);
app.use("/api/marketplace", protect, marketplaceRoutes);
app.use("/api/guestpass", protect, guestPassRoutes);
app.use("/api/upload", protect, uploadRoutes);
app.use("/api/payment", protect, paymentRoutes);
app.use("/api/notices", protect, noticeRoutes);
app.use("/api/maintenance", protect, maintenanceRoutes);
app.use("/api/tickets", protect, ticketRoutes);
app.use("/api/analytics", protect, analyticsRoutes);
app.use("/api/ml", protect, mlRoutes);

/* ================= MIXED / SPECIAL ROUTES ================= */
app.use("/api/polls", pollRoutes); // polls may be public
app.use("/api", mlDataRoutes);

/* ================= TEST ROUTE ================= */
app.get("/api/test", (req, res) => {
  res.json({ msg: "✅ Backend working!" });
});

/* ================= SERVE FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../dist")));

/* ================= SPA FALLBACK ================= */
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
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
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
