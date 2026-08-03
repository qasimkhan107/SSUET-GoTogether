import express from "express";
import {addVehicle, getMyVehicle, updateVehicle, deleteVehicle, } from "../controllers/vehicleController.js";

import { protect } from "../middleware/authMiddleware.js";
import { profileCompleted } from "../middleware/profileMiddleware.js";
import {addVehicleValidator, updateVehicleValidator, validate,} from "../validators/vehicleValidator.js";

const router = express.Router();

router.post("/", protect, profileCompleted, addVehicleValidator, validate, addVehicle);

router.get("/me", protect, getMyVehicle);

router.put("/:id", protect, profileCompleted, updateVehicleValidator, validate, updateVehicle);

router.delete("/:id", protect, profileCompleted, deleteVehicle);

export default router;