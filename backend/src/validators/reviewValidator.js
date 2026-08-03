import { body, validationResult } from "express-validator";

export const createReviewValidator = [
  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("review")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Review cannot exceed 300 characters"),
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