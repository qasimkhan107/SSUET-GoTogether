import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Get Settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "settings"
    );

    res.status(200).json({
      success: true,
      settings: user.settings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Settings
const updateSettings = async (req, res) => {
  try {
    const {
      appNotifications,
      emailNotifications,
      showPhoneAfterAcceptance,
    } = req.body;

    const user = await User.findById(req.user._id);

    user.settings = {
      appNotifications,
      emailNotifications,
      showPhoneAfterAcceptance,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings: user.settings,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getSettings,
  updateSettings,
  changePassword,
};