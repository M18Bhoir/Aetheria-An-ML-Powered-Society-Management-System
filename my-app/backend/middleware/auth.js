import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Add a console log to see why auth is failing
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.error(
        "Auth Middleware: User not found in DB for ID:",
        decoded.id,
      );
      return res.status(401).json({ msg: "User no longer exists" });
    }
    next();
  } catch (err) {
    console.error("Auth Middleware: JWT Verification failed:", err.message);
    res.status(401).json({ msg: "Token is invalid" });
  }
};

export default protect;
