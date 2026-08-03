import express from "express";
import { getDashboardStats, getPendingVerifications, getVerificationById, approveDriver, 
    rejectDriver, approvePassenger, rejectPassenger, getAllUsers, getUserById, blockUser, 
    unblockUser, getAllRides, getRideById, cancelRide, deleteRide, getPendingVerificationCount,} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// User Management
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id", protect, adminOnly, getUserById);
router.put("/users/:id/block", protect, adminOnly, blockUser);
router.put("/users/:id/unblock", protect, adminOnly, unblockUser);

// Verification Requests
router.get("/verifications", protect, adminOnly, getPendingVerifications);
router.get("/verifications/pending-count", protect, adminOnly, getPendingVerificationCount);
router.get("/verification/:id", protect, adminOnly, getVerificationById);

// Driver Verification
router.put("/driver/:id/approve", protect, adminOnly, approveDriver);
router.put("/driver/:id/reject", protect, adminOnly, rejectDriver);

// Passenger Verification
router.put("/passenger/:id/approve", protect, adminOnly, approvePassenger);
router.put("/passenger/:id/reject", protect, adminOnly, rejectPassenger);

// Get all rides
router.get("/rides", protect, adminOnly, getAllRides);

// Get ride details
router.get("/rides/:id", protect, adminOnly, getRideById);

// Cancel ride
router.put("/rides/:id/cancel", protect, adminOnly, cancelRide);

// Delete ride
router.delete("/rides/:id", protect, adminOnly, deleteRide);

export default router;