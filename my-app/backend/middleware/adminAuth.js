import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const adminIdFromToken = decoded.admin?.id;
      if (!adminIdFromToken) {
        return res
          .status(401)
          .json({ msg: "Not authorized, token payload invalid" });
      }

      req.admin = await Admin.findById(adminIdFromToken).select("-password");

      if (!req.admin) {
        return res.status(401).json({ msg: "Not authorized, admin not found" });
      }

      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Not authorized, token expired" });
      }
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  if (!token) {
    // Added return here to prevent execution leak
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};

export default adminAuth;
