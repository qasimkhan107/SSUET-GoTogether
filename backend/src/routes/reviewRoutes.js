import express from "express";
import {createReview, getDriverReviews, getPassengerReviews,} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";
import {createReviewValidator, validate,} from "../validators/reviewValidator.js";

const router = express.Router();

// Create Review
router.post("/", protect, profileCompleted, createReviewValidator, validate, createReview);

// Get Driver Reviews
router.get("/driver", protect, profileCompleted, getDriverReviews);

// Get Passenger Reviews
router.get("/passenger", protect, profileCompleted,getPassengerReviews);

export default router;