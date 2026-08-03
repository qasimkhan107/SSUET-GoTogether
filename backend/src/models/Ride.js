import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  {
    _id: false,
  }
);

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    pickup: {
      type: locationSchema,
      required: true,
    },

    destination: {
      type: locationSchema,
      required: true,
    },

    departureTime: {
      type: Date,
      required: true,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },

    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "ongoing",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },

    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    preferences: {
      smoking: {
        type: Boolean,
        default: false,
      },

      pets: {
        type: Boolean,
        default: false,
      },

      luggage: {
        type: Boolean,
        default: true,
      },

      genderPreference: {
        type: String,
        enum: ["any", "male", "female"],
        default: "any",
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Geo Indexes
rideSchema.index({
  "pickup.location": "2dsphere",
});

rideSchema.index({
  "destination.location": "2dsphere",
});

// Search Indexes
rideSchema.index({
  departureTime: 1,
});

rideSchema.index({
  driver: 1,
});

rideSchema.index({
  status: 1,
});

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;