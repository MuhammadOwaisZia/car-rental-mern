import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  changeRoleToOwner,
  addCar,
  getOwnerCars,
  updateCar,
  deleteCar,
  toggleCarAvailability,
  getOwnerBookings,
  updateBookingStatus,
  getOwnerDashboard,
} from "../controllers/ownerController.js";

const ownerRouter = express.Router();

// All owner routes require auth
ownerRouter.use(protect);

// Role
ownerRouter.post("/change-role", changeRoleToOwner);

// Dashboard
ownerRouter.get("/dashboard", getOwnerDashboard);

// Cars
ownerRouter.get("/cars", getOwnerCars);
ownerRouter.post("/cars/add", upload.single("image"), addCar);
ownerRouter.put("/cars/:id", upload.single("image"), updateCar);
ownerRouter.delete("/cars/:id", deleteCar);
ownerRouter.put("/cars/:id/toggle", toggleCarAvailability);

// Bookings
ownerRouter.get("/bookings", getOwnerBookings);
ownerRouter.put("/bookings/:id/status", updateBookingStatus);

export default ownerRouter;
