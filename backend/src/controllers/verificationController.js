import User from "../models/User.js";

// Passenger Verification
const submitPassengerVerification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "University ID Card is required.",
      });
    }

    const user = await User.findById(req.user._id);

    user.verification.universityIdCard = req.file.path.replace(/\\/g, "/");
    user.verification.passengerStatus = "pending";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Passenger verification submitted successfully.",
      verification: user.verification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Driver Verification
const submitDriverVerification = async (req, res) => {
  try {
    const files = req.files;

    if (
      !files?.universityIdCard ||
      !files?.cnicFront ||
      !files?.cnicBack
    ) {
      return res.status(400).json({
        success: false,
        message:
          "University ID Card, CNIC Front and CNIC Back are required.",
      });
    }

    const user = await User.findById(req.user._id);

    user.verification.universityIdCard =
      files.universityIdCard[0].path.replace(/\\/g, "/");

    user.verification.cnicFront =
      files.cnicFront[0].path.replace(/\\/g, "/");

    user.verification.cnicBack =
      files.cnicBack[0].path.replace(/\\/g, "/");

    user.verification.driverStatus = "pending";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Driver verification submitted successfully.",
      verification: user.verification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  submitPassengerVerification,
  submitDriverVerification,
};