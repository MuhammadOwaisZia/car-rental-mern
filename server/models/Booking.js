import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    car: { type: ObjectId, ref: "Car", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    pickupLocation: { type: String, default: "" },
    dropoffLocation: { type: String, default: "" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
