import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// --- Import Routes ---
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import guestPassRoutes from "./routes/guestPassRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import protect from "./middleware/auth.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import mlRoutes from "./routes/mlroutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/guestpass", guestPassRoutes);
app.use("/api/upload", protect, uploadRoutes);
app.use("/api/payment", protect, paymentRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// 🔮 ML API (can add protect if needed)
app.use("/api/ml", mlRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend working!" });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../dist")));

// SPA fallback
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

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`),
);
