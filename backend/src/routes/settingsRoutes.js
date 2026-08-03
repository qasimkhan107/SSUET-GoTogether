import express from "express";
import {
  getSettings,
  updateSettings,
  changePassword,
} from "../controllers/settingsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  profileCompleted,
  getSettings
);

router.put(
  "/",
  protect,
  profileCompleted,
  updateSettings
);

router.put(
  "/change-password",
  protect,
  profileCompleted,
  changePassword
);

export default router;