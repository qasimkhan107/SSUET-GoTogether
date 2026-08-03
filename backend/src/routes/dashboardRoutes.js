import express from "express";
import {
  getDriverDashboard,
  getPassengerDashboard,
  getUpcomingRide,
  getRecentActivity,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";

const router = express.Router();

router.get(
  "/driver",
  protect,
  profileCompleted,
  getDriverDashboard
);

router.get(
  "/passenger",
  protect,
  profileCompleted,
  getPassengerDashboard
);

router.get(
  "/upcoming",
  protect,
  profileCompleted,
  getUpcomingRide
);

router.get(
  "/activity",
  protect,
  profileCompleted,
  getRecentActivity
);

export default router;