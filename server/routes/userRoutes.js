import express from "express";
import { protect } from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getUserdata,
  getAllCars,
  getCarById,
  createBooking,
  getUserBookings,
  cancelBooking,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Auth
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserdata);

// Cars (public)
userRouter.get("/cars", getAllCars);
userRouter.get("/cars/:id", getCarById);

// Bookings (protected)
userRouter.post("/bookings", protect, createBooking);
userRouter.get("/bookings", protect, getUserBookings);
userRouter.put("/bookings/:id/cancel", protect, cancelBooking);

export default userRouter;
