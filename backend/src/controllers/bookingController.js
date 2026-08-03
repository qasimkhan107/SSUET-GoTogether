import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import createNotification from "../utils/createNotification.js";

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { rideId, seatsBooked = 1, pickupNote } = req.body;

    // Passenger must be approved
    if (
      !req.user.verification ||
      req.user.verification.passengerStatus !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your passenger verification is pending or has not been approved.",
      });
    }

    // Check ride
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Ride must be scheduled
    if (ride.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Ride is not available for booking.",
      });
    }

    // Driver cannot book own ride
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own ride.",
      });
    }

    // Check available seats
    if (ride.availableSeats - ride.bookedSeats < seatsBooked) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available.",
      });
    }

    // Prevent duplicate booking
    const existingBooking = await Booking.findOne({
      ride: rideId,
      passenger: req.user._id,
      status: {
        $in: ["pending", "accepted"],
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You already have an active booking for this ride.",
      });
    }

    // Create booking
    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user._id,
      seatsBooked,
      pickupNote,
    });

    // Notify driver
    await createNotification({
  receiver: ride.driver,
  sender: req.user._id,
  type: "booking",
  title: "New Booking Request",
  message: `${req.user.name} has requested to join your ride.`,
});

    const populatedBooking = await Booking.findById(booking._id)
      .populate("ride")
      .populate("passenger", "name rollNumber");

    res.status(201).json({
      success: true,
      message: "Booking request sent successfully.",
      booking: populatedBooking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accept Booking
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("ride")
      .populate("passenger", "name rollNumber");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Check if ride exists
    if (!booking.ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    const ride = booking.ride;

    // Only driver can accept
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Booking must be pending
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking has already been processed.",
      });
    }

    // Check available seats
    if (ride.availableSeats - ride.bookedSeats < booking.seatsBooked) {
      return res.status(400).json({
        success: false,
        message: "No seats available.",
      });
    }

    // Accept booking
    booking.status = "accepted";

    // Update ride
    ride.bookedSeats += booking.seatsBooked;
    ride.passengers.push(booking.passenger._id);

    await ride.save();
    await booking.save();

    // Notify passenger
    await createNotification({
  receiver: booking.passenger._id,
  sender: req.user._id,
  type: "accepted",
  title: "Booking Accepted",
  message: "Your booking request has been accepted.",
});

    // Return updated booking with populated data
    const updatedBooking = await Booking.findById(booking._id)
      .populate("passenger", "name rollNumber")
      .populate({
        path: "ride",
        populate: [
          {
            path: "driver",
            select: "name rollNumber rating",
          },
          {
            path: "vehicle",
            select:
              "vehicleType brand model color registrationNumber",
          },
        ],
      });

    res.status(200).json({
      success: true,
      message: "Booking accepted successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject Booking
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("ride")
      .populate("passenger", "name rollNumber");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const ride = await Ride.findById(booking.ride._id);

    // Only driver can reject
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Only pending bookings
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking has already been processed.",
      });
    }

    booking.status = "rejected";
    await booking.save();

   await createNotification({
  receiver: booking.passenger._id,
  sender: req.user._id,
  type: "rejected",
  title: "Booking Rejected",
  message: "Your booking request has been rejected by the driver.",
});

    const updatedBooking = await Booking.findById(booking._id)
      .populate("passenger", "name rollNumber")
      .populate({
        path: "ride",
        populate: [
          {
            path: "driver",
            select: "name rollNumber rating",
          },
          {
            path: "vehicle",
            select:
              "vehicleType brand model color registrationNumber",
          },
        ],
      });

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully.",
      booking: updatedBooking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Bookings (Passenger)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      passenger: req.user._id,
    })
      .populate({
        path: "ride",
        populate: [
          {
            path: "driver",
            select: "name rollNumber phone rating",
          },
          {
            path: "vehicle",
            select:
              "vehicleType brand model color registrationNumber",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Bookings For a Ride (Driver)
const getRideBookings = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Only the ride owner can view bookings
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const bookings = await Booking.find({
      ride: ride._id,
    })
      .populate("passenger", "name rollNumber phone rating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Booking (Passenger)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Only passenger can cancel
    if (booking.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled.",
      });
    }

    // If already accepted, free the seat
    if (booking.status === "accepted") {
      const ride = await Ride.findById(booking.ride);

      if (ride) {
        ride.bookedSeats -= booking.seatsBooked;

        ride.passengers = ride.passengers.filter(
          (id) => id.toString() !== booking.passenger.toString()
        );

        await ride.save();
      }
    }

    booking.status = "cancelled";
    await booking.save();

    const ride = await Ride.findById(booking.ride);

await createNotification({
  receiver: ride.driver,
  sender: req.user._id,
  type: "cancelled",
  title: "Booking Cancelled",
  message: `${req.user.name} cancelled their booking.`,
});

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createBooking, acceptBooking, rejectBooking, getMyBookings, getRideBookings, cancelBooking,};