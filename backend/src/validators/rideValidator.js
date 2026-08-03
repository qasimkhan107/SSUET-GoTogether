import { body, validationResult } from "express-validator";

export const createRideValidator = [
  body("pickup.address")
    .trim()
    .notEmpty()
    .withMessage("Pickup address is required"),

  body("pickup.location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Pickup coordinates are required"),

  body("destination.address")
    .trim()
    .notEmpty()
    .withMessage("Destination address is required"),

  body("destination.location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Destination coordinates are required"),

  body("departureTime")
    .isISO8601()
    .withMessage("Departure time must be a valid date"),

  body("availableSeats")
    .isInt({ min: 1, max: 7 })
    .withMessage("Available seats must be between 1 and 7"),

  body("pricePerSeat")
    .isFloat({ min: 0 })
    .withMessage("Price per seat must be a positive number"),
];

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