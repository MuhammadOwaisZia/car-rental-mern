import JWT from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log(" Decoded token:", decoded);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.json({ success: false, message: "User not found" });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: "Not authorized, invalid token" });
  }
};
