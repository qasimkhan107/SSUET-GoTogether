import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

const createReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId).populate({
      path: "ride",
      populate: {
        path: "driver",
        select: "name rollNumber rating",
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Only passenger can review
    if (booking.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Booking must be completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed trips can be reviewed.",
      });
    }

    // Prevent duplicate reviews
    const alreadyReviewed = await Review.findOne({
      booking: bookingId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this trip.",
      });
    }

    // Create review
    const newReview = await Review.create({
  driver: booking.ride.driver._id,
  passenger: booking.passenger,
  ride: booking.ride._id,
  booking: booking._id,
  rating,
  review,
  reviewedBy: "passenger",
});

    // Update driver's average rating
    const reviews = await Review.find({
      driver: booking.ride.driver._id,
    });

    const totalRating = reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    await User.findByIdAndUpdate(
  booking.ride.driver._id,
  {
    rating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
  }
);

    // Return populated review
    const populatedReview = await Review.findById(newReview._id)
      .populate("driver", "name rollNumber rating")
      .populate("passenger", "name rollNumber")
      .populate(
        "ride",
        "pickup destination departureTime pricePerSeat"
      );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: populatedReview,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      driver: req.user._id,
    })
      .populate("passenger", "name rollNumber")
      .populate(
        "ride",
        "pickup destination departureTime pricePerSeat"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPassengerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      passenger: req.user._id,
    })
      .populate("driver", "name rollNumber rating")
      .populate(
        "ride",
        "pickup destination departureTime pricePerSeat"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createReview,
  getDriverReviews,
  getPassengerReviews,
};