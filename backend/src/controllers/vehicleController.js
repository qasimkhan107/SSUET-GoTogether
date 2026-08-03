import Vehicle from "../models/Vehicle.js";

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      brand,
      model,
      color,
      registrationNumber,
      seatsAvailable,
      fuelType,
    } = req.body;

    // Check if user already has a vehicle
    const existingVehicle = await Vehicle.findOne({
      owner: req.user._id,
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "You have already registered a vehicle.",
      });
    }

    // Check duplicate registration number
    const duplicateVehicle = await Vehicle.findOne({
      registrationNumber: registrationNumber.toUpperCase(),
    });

    if (duplicateVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle registration number already exists.",
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      vehicleType,
      brand,
      model,
      color,
      registrationNumber: registrationNumber.toUpperCase(),
      seatsAvailable,
      fuelType,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully.",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Vehicle
const getMyVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      owner: req.user._id,
    }).populate("owner", "name rollNumber");

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "No vehicle found.",
      });
    }

    res.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Ensure only the owner can update
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const {
      vehicleType,
      brand,
      model,
      color,
      registrationNumber,
      seatsAvailable,
      fuelType,
    } = req.body;

    if (vehicleType) vehicle.vehicleType = vehicleType;
    if (brand) vehicle.brand = brand;
    if (model) vehicle.model = model;
    if (color) vehicle.color = color;
    if (
      registrationNumber &&
      registrationNumber.toUpperCase() !== vehicle.registrationNumber
    ) {
        const existingVehicle = await Vehicle.findOne({
        registrationNumber: registrationNumber.toUpperCase(),
      });

      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message: "Registration number already exists.",
        });
      }

    vehicle.registrationNumber =
    registrationNumber.toUpperCase();
    }
    
    if (seatsAvailable) vehicle.seatsAvailable = seatsAvailable;
    if (fuelType) vehicle.fuelType = fuelType;

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addVehicle, getMyVehicle, updateVehicle, deleteVehicle, };