import User from "../models/User.js";
import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import Vehicle from "../models/Vehicle.js";

const getPendingVerificationCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
  $or: [
    { "verification.driverStatus": "pending" },
    { "verification.passengerStatus": "pending" },
  ],
});

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Admin Dashboard Statistics
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),

      approvedDrivers: await User.countDocuments({
        "verification.driverStatus": "approved",
      }),

      pendingDrivers: await User.countDocuments({
        "verification.driverStatus": "pending",
      }),

      approvedPassengers: await User.countDocuments({
        "verification.passengerStatus": "approved",
      }),

      pendingPassengers: await User.countDocuments({
        "verification.passengerStatus": "pending",
      }),

      totalRides: await Ride.countDocuments(),

      scheduledRides: await Ride.countDocuments({
        status: "scheduled",
      }),

      ongoingRides: await Ride.countDocuments({
        status: "ongoing",
      }),

      completedRides: await Ride.countDocuments({
        status: "completed",
      }),

      cancelledRides: await Ride.countDocuments({
        status: "cancelled",
      }),

      totalBookings: await Booking.countDocuments(),

      pendingBookings: await Booking.countDocuments({
        status: "pending",
      }),

      acceptedBookings: await Booking.countDocuments({
        status: "accepted",
      }),

      rejectedBookings: await Booking.countDocuments({
        status: "rejected",
      }),

      cancelledBookings: await Booking.countDocuments({
        status: "cancelled",
      }),
    };

    res.status(200).json({
      success: true,
      stats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Pending Verification Requests
// ===============================
const getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { "verification.driverStatus": "pending" },
        { "verification.passengerStatus": "pending" },
      ],
    }).select(
      "name rollNumber email department verification"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Single Verification Request
// ===============================
const getVerificationById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name rollNumber email department phone verification"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Approve Driver
// ===============================
const approveDriver = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.verification.driverStatus = "approved";
    await user.save();

    await Notification.create({
      receiver: user._id,
      sender: req.user._id,
      type: "verification",
      title: "Driver Verification Approved",
      message: "Your driver verification has been approved.",
    });

    res.status(200).json({
      success: true,
      message: "Driver approved successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Reject Driver
// ===============================
const rejectDriver = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.verification.driverStatus = "rejected";
    await user.save();

    await Notification.create({
      receiver: user._id,
      sender: req.user._id,
      type: "verification",
      title: "Driver Verification Rejected",
      message: "Your submitted documents were rejected.",
    });

    res.status(200).json({
      success: true,
      message: "Driver rejected successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Approve Passenger
// ===============================
const approvePassenger = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.verification.passengerStatus = "approved";
    await user.save();

    await Notification.create({
      receiver: user._id,
      sender: req.user._id,
      type: "verification",
      title: "Passenger Verification Approved",
      message: "Your passenger verification has been approved.",
    });

    res.status(200).json({
      success: true,
      message: "Passenger approved successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Reject Passenger
// ===============================
const rejectPassenger = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.verification.passengerStatus = "rejected";
    await user.save();

    await Notification.create({
      receiver: user._id,
      sender: req.user._id,
      type: "verification",
      title: "Passenger Verification Rejected",
      message: "Please upload a valid university ID card.",
    });

    res.status(200).json({
      success: true,
      message: "Passenger rejected successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Users
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const {
      search = "",
      role,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          rollNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get User Details
// ===============================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const vehicle = await Vehicle.findOne({
      owner: user._id,
    });

    res.status(200).json({
      success: true,
      user,
      vehicle,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Block User
// ===============================
const blockUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isBlocked = true;

    await user.save();

    await Notification.create({
      receiver: user._id,
      sender: req.user._id,
      type: "verification",
      title: "Account Blocked",
      message: "Your account has been blocked by the administrator.",
    });

    res.status(200).json({
      success: true,
      message: "User blocked successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Unblock User
// ===============================
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isBlocked = false;

    await user.save();

    await Notification.create({
      receiver: user._id,
      sender: req.user._id,
      type: "verification",
      title: "Account Restored",
      message: "Your account has been restored by the administrator.",
    });

    res.status(200).json({
      success: true,
      message: "User unblocked successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Rides
// ===============================
const getAllRides = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "",
      search = "",
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate("driver", "name rollNumber")
      .populate("vehicle", "registrationNumber vehicleType")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    let filtered = rides;

    if (search) {
      filtered = rides.filter((ride) =>
        ride.driver?.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    const total = await Ride.countDocuments(query);

    res.status(200).json({
      success: true,
      rides: filtered,
      totalPages: Math.ceil(total / limit),
      totalRides: total,
      page: Number(page),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Ride Details
// ===============================
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate(
        "driver",
        "name rollNumber phone email"
      )
      .populate(
        "vehicle",
        "brand model vehicleType color registrationNumber seatsAvailable fuelType"
      )
      .populate(
        "passengers",
        "name rollNumber email phone"
      );

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

// ===============================
// Cancel Ride
// ===============================
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    ride.status = "cancelled";

    await ride.save();

    res.status(200).json({
      success: true,
      message: "Ride cancelled successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Ride
// ===============================
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    await ride.deleteOne();

    res.status(200).json({
      success: true,
      message: "Ride deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {getDashboardStats, getPendingVerifications, getVerificationById, approveDriver, 
  rejectDriver, approvePassenger, rejectPassenger, getAllUsers, getUserById, blockUser, 
  unblockUser, getAllRides, getRideById, cancelRide, deleteRide, getPendingVerificationCount,
};