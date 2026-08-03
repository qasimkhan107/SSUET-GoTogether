import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  registerValidator,
  validate,
} from "../validators/authValidator.js";

const router = express.Router();

// Public Routes
router.post("/register", registerValidator, validate, register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);

// NEW
router.post("/verify-otp", verifyOTP);

// NEW
router.put("/reset-password", resetPassword);

// Protected Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;