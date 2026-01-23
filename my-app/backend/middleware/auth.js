import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userIdFromToken = decoded.user?.id;
      if (!userIdFromToken) {
        return res
          .status(401)
          .json({ msg: "Not authorized, token payload invalid" });
      }

      req.user = await User.findById(userIdFromToken).select("-password");

      if (!req.user) {
        return res.status(401).json({ msg: "Not authorized, user not found" });
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

export default protect;
