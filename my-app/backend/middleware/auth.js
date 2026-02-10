import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js"; // Must import Admin to verify admin tokens

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. Extract the ID from the nested payload structure you defined in authRoutes
    const accountId = decoded.user?.id || decoded.admin?.id;

    if (!accountId) {
      console.error("Auth Middleware: No ID found in token payload");
      return res.status(401).json({ msg: "Invalid token structure" });
    }

    // 2. Look for the account in both Resident and Admin collections
    let account = await User.findById(accountId).select("-password");
    if (!account) {
      account = await Admin.findById(accountId).select("-password");
    }

    if (!account) {
      console.error("Auth Middleware: Account not found for ID:", accountId);
      return res.status(401).json({ msg: "Account no longer exists" });
    }

    req.user = account;
    next();
  } catch (err) {
    console.error("Auth Middleware: JWT Verification failed:", err.message);
    res.status(401).json({ msg: "Token is invalid" });
  }
};

export default protect;
