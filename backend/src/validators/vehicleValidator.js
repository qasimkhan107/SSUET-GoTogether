import { body, validationResult } from "express-validator";

/* ===========================
   Add Vehicle Validator
=========================== */

export const addVehicleValidator = [
  body("vehicleType")
    .trim()
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isIn(["Car", "Bike"])
    .withMessage("Vehicle type must be Car or Bike"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Brand must be between 2 and 30 characters"),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Model is required")
    .isLength({ min: 1, max: 30 })
    .withMessage("Model must be between 1 and 30 characters"),

  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required"),

  body("registrationNumber")
    .trim()
    .notEmpty()
    .withMessage("Registration number is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid registration number"),

  body("seatsAvailable")
    .isInt({ min: 1, max: 7 })
    .withMessage("Seats must be between 1 and 7"),

  body("fuelType")
    .trim()
    .notEmpty()
    .withMessage("Fuel type is required")
    .isIn(["Petrol", "Diesel", "Electric", "Hybrid"])
    .withMessage("Invalid fuel type"),
];

/* ===========================
   Update Vehicle Validator
=========================== */

export const updateVehicleValidator = [
  body("vehicleType")
    .optional()
    .trim()
    .isIn(["Car", "Bike"])
    .withMessage("Vehicle type must be Car or Bike"),

  body("brand")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Brand must be between 2 and 30 characters"),

  body("model")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Model must be between 1 and 30 characters"),

  body("color")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Color cannot be empty"),

  body("registrationNumber")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid registration number"),

  body("seatsAvailable")
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage("Seats must be between 1 and 7"),

  body("fuelType")
    .optional()
    .trim()
    .isIn(["Petrol", "Diesel", "Electric", "Hybrid"])
    .withMessage("Invalid fuel type"),
];

/* ===========================
   Validation Result
=========================== */

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};