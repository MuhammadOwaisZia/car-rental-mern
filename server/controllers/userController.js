import User from "../models/user.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

// ─── AUTH ──────────────────────────────────────────────────

// POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Fill all the fields properly" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/user/data
export const getUserdata = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ─── CARS (public browsing) ────────────────────────────────

// GET /api/user/cars
export const getAllCars = async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice } = req.query;

    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/user/cars/:id
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("owner", "name email");
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }
    res.json({ success: true, car });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ─── BOOKINGS ─────────────────────────────────────────────

// POST /api/user/bookings
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }
    if (!car.isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.json({ success: false, message: "End date must be after start date" });
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    });

    if (overlap) {
      return res.json({ success: false, message: "Car is already booked for these dates" });
    }

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * car.pricePerDay;

    const booking = await Booking.create({
      user: _id,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      pickupLocation: pickupLocation || car.location,
      dropoffLocation: dropoffLocation || car.location,
    });

    res.json({ success: true, message: "Booking created successfully", booking });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/user/bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car", "brand model image pricePerDay location")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// PUT /api/user/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { _id } = req.user;

    const booking = await Booking.findOne({ _id: req.params.id, user: _id });
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.json({ success: false, message: `Booking already ${booking.status}` });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
