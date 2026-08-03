const profileCompleted = (req, res, next) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      success: false,
      message: "Please complete your profile before using this feature.",
    });
  }

  next();
};

export { profileCompleted };