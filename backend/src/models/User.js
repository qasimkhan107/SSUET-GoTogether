import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    rollNumber: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "SSUET email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\d{4}F-[A-Z]{2,5}-\d{3}@ssuet\.edu\.pk$/i,
        "Please enter a valid SSUET email",
      ],
    },

    recoveryEmail: {
  type: String,
  trim: true,
  lowercase: true,
},

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },

    department: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

   isBlocked: {
      type: Boolean,
      default: false,
    },

    verification: {
      universityIdCard: {
        type: String,
        default: "",
      },

      cnicFront: {
        type: String,
        default: "",
      },

      cnicBack: {
        type: String,
        default: "",
      },

      passengerStatus: {
        type: String,
        enum: [
          "not_submitted",
          "pending",
          "approved",
          "rejected",
        ],
        default: "not_submitted",
      },

      driverStatus: {
        type: String,
        enum: [
          "not_submitted",
          "pending",
          "approved",
          "rejected",
        ],
        default: "not_submitted",
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
  type: Number,
  default: 0,
  min: 0,
},

    totalTrips: {
      type: Number,
      default: 0,
      min: 0,
    },

    settings: {
  appNotifications: {
    type: Boolean,
    default: true,
  },

  emailNotifications: {
    type: Boolean,
    default: true,
  },

  showPhoneAfterAcceptance: {
    type: Boolean,
    default: true,
  },
},

resetOTP: {
  type: String,
},

resetOTPExpire: {
  type: Date,
},

  },
  {
    timestamps: true,
  }
);

// Automatically generate roll number from email
userSchema.pre("validate", function () {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
    this.rollNumber = this.email.split("@")[0].toUpperCase();
  }
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;