import { body, validationResult } from "express-validator";

export const createBookingValidator = [
  body("rideId")
    .notEmpty()
    .withMessage("Ride ID is required.")
    .isMongoId()
    .withMessage("Invalid Ride ID."),

  body("seatsBooked")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Seats booked must be at least 1."),

  body("pickupNote")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Pickup note cannot exceed 200 characters."),
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