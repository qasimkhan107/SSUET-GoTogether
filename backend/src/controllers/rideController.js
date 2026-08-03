import Ride from "../models/Ride.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import createNotification from "../utils/createNotification.js";

// Create Ride
const createRide = async (req, res) => {
  try {
    const {
      pickup,
      destination,
      departureTime,
      availableSeats,
      pricePerSeat,
      preferences,
      notes,
    } = req.body;

    // Driver must be approved
    if (
      !req.user.verification ||
      req.user.verification.driverStatus !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your driver verification is pending or has not been approved.",
      });
    }

    // Check if user has a vehicle
    const vehicle = await Vehicle.findOne({
      owner: req.user._id,
    });

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: "Please register a vehicle first.",
      });
    }

    // Seats cannot exceed vehicle capacity
    if (availableSeats > vehicle.seatsAvailable) {
      return res.status(400).json({
        success: false,
        message: `Vehicle only has ${vehicle.seatsAvailable} seats.`,
      });
    }

    // Departure time must be in the future
    if (new Date(departureTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Departure time must be in the future.",
      });
    }

    // Prevent multiple active rides
    const activeRide = await Ride.findOne({
      driver: req.user._id,
      status: {
        $in: ["scheduled", "ongoing"],
      },
    });

    if (activeRide) {
      return res.status(400).json({
        success: false,
        message: "You already have an active ride.",
      });
    }

    // Create ride
    const ride = await Ride.create({
      driver: req.user._id,
      vehicle: vehicle._id,
      pickup,
      destination,
      departureTime,
      availableSeats,
      pricePerSeat,
      preferences,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Ride created successfully.",
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Available Rides
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "scheduled",
      driver: { $ne: req.user._id },
      $expr: {
        $gt: ["$availableSeats", "$bookedSeats"],
      },
    })
      .populate("driver", "name rollNumber rating")
      .populate("vehicle", "vehicleType brand model color")
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Ride By ID
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
   .populate("driver", "name rollNumber rating phone")
    .populate(
    "vehicle",
    "vehicleType brand model color registrationNumber seatsAvailable fuelType verified"
  )
     .populate("passengers", "name rollNumber");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    res.status(200).json({
      success: true,
      ride,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Rides
const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({
    driver: req.user._id,
})
    .populate("driver", "name rollNumber rating")
   .populate(
    "vehicle",
    "vehicleType brand model color registrationNumber"
  )
   .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
  console.error("getMyRides Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });

  }
};

// Update Ride
const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Only ride owner can update
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Only scheduled rides can be updated
    if (ride.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled rides can be updated.",
      });
    }

    const {
      pickup,
      destination,
      departureTime,
      availableSeats,
      pricePerSeat,
      preferences,
      notes,
    } = req.body;

    if (pickup) ride.pickup = pickup;
    if (destination) ride.destination = destination;
    if (departureTime) {

  if (new Date(departureTime) <= new Date()) {
    return res.status(400).json({
      success:false,
      message:"Departure time must be in the future."
    });
  }

  ride.departureTime = departureTime;
}
    if (availableSeats) {
  const vehicle = await Vehicle.findById(ride.vehicle);

  if (availableSeats > vehicle.seatsAvailable) {
    return res.status(400).json({
      success: false,
      message: `Vehicle only has ${vehicle.seatsAvailable} seats.`,
    });
  }

  if (availableSeats < ride.bookedSeats) {
    return res.status(400).json({
      success: false,
      message: "Available seats cannot be less than booked seats.",
    });
  }

  ride.availableSeats = availableSeats;
}
    if (pricePerSeat) ride.pricePerSeat = pricePerSeat;
    if (preferences) ride.preferences = preferences;
    if (notes !== undefined) ride.notes = notes;

  await ride.save();

const updatedRide = await Ride.findById(ride._id)
  .populate("driver", "name rollNumber rating")
  .populate(
    "vehicle",
    "vehicleType brand model color registrationNumber"
  );

res.status(200).json({
  success: true,
  message: "Ride updated successfully.",
  ride: updatedRide,
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Ride
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Only driver can cancel
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Already cancelled
    if (ride.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Ride is already cancelled.",
      });
    }

    // Completed rides cannot be cancelled
    if (ride.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed rides cannot be cancelled.",
      });
    }

    // Find all pending and accepted bookings
    const bookings = await Booking.find({
      ride: ride._id,
      status: {
        $in: ["pending", "accepted"],
      },
    });

    // Notify all affected passengers
    for (const booking of bookings) {
  await createNotification({
    receiver: booking.passenger,
    sender: req.user._id,
    type: "cancelled",
    title: "Ride Cancelled",
    message: "The ride you booked has been cancelled by the driver.",
  });
}

    // Cancel all pending and accepted bookings
    await Booking.updateMany(
      {
        ride: ride._id,
        status: {
          $in: ["pending", "accepted"],
        },
      },
      {
        $set: {
          status: "cancelled",
        },
      }
    );

    // Cancel the ride
    ride.status = "cancelled";
    await ride.save();

    const cancelledRide = await Ride.findById(ride._id)
      .populate("driver", "name rollNumber rating")
      .populate(
        "vehicle",
        "vehicleType brand model color registrationNumber"
      );

    res.status(200).json({
      success: true,
      message: "Ride cancelled successfully.",
      ride: cancelledRide,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Complete Ride
const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Only driver can complete the ride
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (ride.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Ride already completed.",
      });
    }

    // Complete ride
    ride.status = "completed";
    await ride.save();

    // Get accepted bookings before updating them
    const acceptedBookings = await Booking.find({
      ride: ride._id,
      status: "accepted",
    });

    // Mark accepted bookings as completed
    await Booking.updateMany(
      {
        ride: ride._id,
        status: "accepted",
      },
      {
        status: "completed",
      }
    );

    // Send notification to each passenger
    for (const booking of acceptedBookings) {
      await createNotification({
        receiver: booking.passenger,
        sender: req.user._id,
        type: "completed",
        title: "Ride Completed",
        message: "Your ride has been marked as completed by the driver.",
      });
    }

    // Increase driver's total trips
    await User.findByIdAndUpdate(
      ride.driver,
      {
        $inc: { totalTrips: 1 },
      }
    );

    // Increase passengers' total trips
    if (ride.passengers.length > 0) {
      await User.updateMany(
        {
          _id: { $in: ride.passengers },
        },
        {
          $inc: { totalTrips: 1 },
        }
      );
    }

    const updatedRide = await Ride.findById(ride._id)
      .populate("driver", "name rollNumber totalTrips")
      .populate(
        "passengers",
        "name rollNumber totalTrips"
      );

    res.status(200).json({
      success: true,
      message: "Ride completed successfully.",
      ride: updatedRide,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchRides = async (req, res) => {
  try {
    const {
      pickup,
      destination,
      date,
      seats,
      maxPrice,
    } = req.query;

    const query = {
    status:"scheduled",
    driver:{
        $ne:req.user._id,
    },
};

    // Pickup
    if (pickup) {
      query["pickup.address"] = {
        $regex: pickup,
        $options: "i",
      };
    }

    // Destination
    if (destination) {
      query["destination.address"] = {
        $regex: destination,
        $options: "i",
      };
    }

    // Minimum available seats
    if (seats) {
      query.availableSeats = {
        $gte: Number(seats),
      };
    }

    // Maximum price
    if (maxPrice) {
      query.pricePerSeat = {
        $lte: Number(maxPrice),
      };
    }

    // Departure Date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      query.departureTime = {
        $gte: start,
        $lt: end,
      };
    }

    const rides = await Ride.find({
    ...query,
    $expr:{
        $gt:["$availableSeats","$bookedSeats"]
    }
})
      .populate("driver", "name rollNumber rating")
      .populate(
        "vehicle",
        "vehicleType brand model color registrationNumber"
      )
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createRide, getAllRides, getRideById, getMyRides, updateRide, cancelRide, completeRide, searchRides,};