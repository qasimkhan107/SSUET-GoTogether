import express from "express";
import { createBooking, acceptBooking, rejectBooking, getMyBookings, getRideBookings, cancelBooking,} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";
import {
  createBookingValidator,
  validate,
} from "../validators/bookingValidator.js";

const router = express.Router();

router.post("/", protect, profileCompleted, createBookingValidator, validate, createBooking);
router.get("/my-bookings", protect, profileCompleted, getMyBookings);
router.get("/ride/:rideId", protect, profileCompleted, getRideBookings);
router.put("/:id/accept", protect, acceptBooking);
router.put("/:id/reject", protect, rejectBooking);
router.put("/:id/cancel", protect, profileCompleted, cancelBooking);

export default router;