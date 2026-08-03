import express from "express";
import {
  submitPassengerVerification,
  submitDriverVerification,
} from "../controllers/verificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Passenger Verification
router.post(
  "/passenger",
  protect,
  profileCompleted,
  upload.single("universityIdCard"),
  submitPassengerVerification
);

// Driver Verification
router.post(
  "/driver",
  protect,
  profileCompleted,
  upload.fields([
    {
      name: "universityIdCard",
      maxCount: 1,
    },
    {
      name: "cnicFront",
      maxCount: 1,
    },
    {
      name: "cnicBack",
      maxCount: 1,
    },
  ]),
  submitDriverVerification
);

export default router;