import imageKit from "../configs/imageKit.js";
import User from "../models/user.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import fs from "fs";

// ─── ROLE ─────────────────────────────────────────────────

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list your cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ─── CARS ─────────────────────────────────────────────────

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Car image is required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const uploaded = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    fs.unlinkSync(imageFile.path);

    const newCar = await Car.create({
      ...car,
      owner: _id,
      image: uploaded.url,
    });

    res.json({ success: true, message: "Car added successfully", car: newCar });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = await Car.findOne({ _id: req.params.id, owner: _id });

    if (!car) {
      return res.json({ success: false, message: "Car not found or unauthorized" });
    }

    let imageUrl = car.image;

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const uploaded = await imageKit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/cars",
      });
      fs.unlinkSync(req.file.path);
      imageUrl = uploaded.url;
    }

    const updatedData = req.body.carData ? JSON.parse(req.body.carData) : req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { ...updatedData, image: imageUrl },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: "Car updated", car: updatedCar });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = await Car.findOne({ _id: req.params.id, owner: _id });

    if (!car) {
      return res.json({ success: false, message: "Car not found or unauthorized" });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = await Car.findOne({ _id: req.params.id, owner: _id });

    if (!car) {
      return res.json({ success: false, message: "Car not found or unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? "available" : "unavailable"}`,
      isAvailable: car.isAvailable,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ─── BOOKINGS ─────────────────────────────────────────────

export const getOwnerBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const ownerCars = await Car.find({ owner: _id }).select("_id");
    const carIds = ownerCars.map((c) => c._id);

    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate("car", "brand model image pricePerDay location")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id).populate("car");

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: `Booking ${status}`, booking });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ─── DASHBOARD ────────────────────────────────────────────

export const getOwnerDashboard = async (req, res) => {
  try {
    const { _id } = req.user;

    const ownerCars = await Car.find({ owner: _id }).select("_id");
    const carIds = ownerCars.map((c) => c._id);

    const bookings = await Booking.find({ car: { $in: carIds } });

    const totalRevenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const totalCars = ownerCars.length;
    const availableCars = await Car.countDocuments({ owner: _id, isAvailable: true });
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === "pending").length;

    const recentBookings = await Booking.find({ car: { $in: carIds } })
      .populate("car", "brand model image")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboard: {
        totalRevenue,
        totalCars,
        availableCars,
        totalBookings,
        pendingBookings,
        recentBookings,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
