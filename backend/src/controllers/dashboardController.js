import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";

const getDriverDashboard = async (req, res) => {
  try {
    const driverId = req.user._id;

    const totalRides = await Ride.countDocuments({
      driver: driverId,
    });

    const scheduledRides = await Ride.countDocuments({
      driver: driverId,
      status: "scheduled",
    });

    const completedRides = await Ride.countDocuments({
      driver: driverId,
      status: "completed",
    });

    const cancelledRides = await Ride.countDocuments({
      driver: driverId,
      status: "cancelled",
    });

    const rides = await Ride.find({
      driver: driverId,
    });

    let totalPassengers = 0;
    let totalEarnings = 0;

    rides.forEach((ride) => {
      totalPassengers += ride.passengers.length;

      if (ride.status === "completed") {
        totalEarnings +=
          ride.bookedSeats * ride.pricePerSeat;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRides,
        scheduledRides,
        completedRides,
        cancelledRides,
        totalPassengers,
        totalEarnings,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPassengerDashboard = async (req, res) => {
  try {
    const passengerId = req.user._id;

    const totalBookings = await Booking.countDocuments({
      passenger: passengerId,
    });

    const pendingBookings = await Booking.countDocuments({
      passenger: passengerId,
      status: "pending",
    });

    const acceptedBookings = await Booking.countDocuments({
      passenger: passengerId,
      status: "accepted",
    });

    const completedTrips = await Booking.countDocuments({
      passenger: passengerId,
      status: "completed",
    });

    const cancelledBookings = await Booking.countDocuments({
      passenger: passengerId,
      status: "cancelled",
    });

    const rejectedBookings = await Booking.countDocuments({
      passenger: passengerId,
      status: "rejected",
    });

    const bookings = await Booking.find({
      passenger: passengerId,
    }).populate("ride");

    let totalSpent = 0;

    bookings.forEach((booking) => {
      if (
        booking.status === "completed" &&
        booking.ride
      ) {
        totalSpent +=
          booking.seatsBooked *
          booking.ride.pricePerSeat;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        acceptedBookings,
        completedTrips,
        cancelledBookings,
        rejectedBookings,
        totalSpent,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUpcomingRide = async (req, res) => {
  try {
    const isDriver =
      req.user.verification?.driverStatus === "approved";

    let ride;

    if (isDriver) {
      ride = await Ride.findOne({
  driver: req.user._id,
  status: "scheduled",
})
.sort({ departureTime: 1 })
.populate("driver", "name rollNumber")
.populate("passengers", "name rollNumber");
    } else {
      const booking = await Booking.findOne({
        passenger: req.user._id,
        status: "accepted",
      })
        .populate({
          path: "ride",
          populate: {
            path: "driver",
            select: "name rollNumber",
          },
        })
        .sort({ createdAt: -1 });

      ride = booking?.ride;
    }

    res.json({
      success: true,
      ride,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const isDriver =
      req.user.verification?.driverStatus === "approved";

    let activities = [];

    if (isDriver) {
      const rides = await Ride.find({
        driver: req.user._id,
      })
        .sort({ updatedAt: -1 })
        .limit(5);

      activities = rides.map((ride) => ({
        title: `Ride ${ride.status}`,
        time: ride.updatedAt,
      }));
    } else {
      const bookings = await Booking.find({
        passenger: req.user._id,
      })
        .populate("ride")
        .sort({ updatedAt: -1 })
        .limit(5);

      activities = bookings.map((booking) => ({
        title: `Booking ${booking.status}`,
        time: booking.updatedAt,
      }));
    }

    res.status(200).json({
      success: true,
      activities,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getDriverDashboard,
  getPassengerDashboard,
  getUpcomingRide,
  getRecentActivity,
};