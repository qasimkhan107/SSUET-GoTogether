import express from "express";
import { createRide, getAllRides, getRideById, getMyRides, updateRide, cancelRide, completeRide, searchRides,} from "../controllers/rideController.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";
import {createRideValidator, validate,} from "../validators/rideValidator.js";

const router = express.Router();


router.post("/", protect, profileCompleted, createRideValidator, validate, createRide);
router.get("/", protect, getAllRides);
router.get("/my-rides", protect, getMyRides);
router.get("/search", protect, searchRides);
router.get("/:id", protect, getRideById);
router.put("/:id", protect, profileCompleted, updateRide);
router.put("/:id/complete", protect, profileCompleted, completeRide);
router.delete("/:id", protect, cancelRide);

export default router;