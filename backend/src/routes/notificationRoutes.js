import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";

const router = express.Router();

// Get all notifications
router.get(
  "/",
  protect,
  profileCompleted,
  getNotifications
);

// Mark all notifications as read
router.put(
  "/read-all",
  protect,
  profileCompleted,
  markAllAsRead
);

// Mark single notification as read
router.put(
  "/:id/read",
  protect,
  profileCompleted,
  markAsRead
);

// Delete notification
router.delete(
  "/:id",
  protect,
  profileCompleted,
  deleteNotification
);

export default router;