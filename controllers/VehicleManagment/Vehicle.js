const Vehicle = require("../../models/UserManagment/VehicleSchema");
const Driver = require("../../models/UserManagment/DriverSchema");
const { NotFoundError, BadRequestError } = require("../../utils/ExpressError");

const createVehicle = async (req, res) => {
  const {
    driverId,
    model,
    vehicleType,
    color,
    year,
    owner,
    licensePlateNo,
    chassisNo
  } = req.body;

  
    if (vehicleType && vehicleType.toLowerCase() === "bike") {
      seat = "1";
    } else if (vehicleType && vehicleType.toLowerCase() === "car") {
      seat = "4";
    } else if (vehicleType && vehicleType.toLowerCase() === "auto") {
      seat = "3";
    }

  const vehicleFrontImage = req.files?.vehicleFrontImage?.[0] ? {
    url: req.files.vehicleFrontImage[0].path,
    filename: req.files.vehicleFrontImage[0].filename
  } : null;

  const vehicleBackImage = req.files?.vehicleBackImage?.[0] ? {
    url: req.files.vehicleBackImage[0].path,
    filename: req.files.vehicleBackImage[0].filename
  } : null;

  const vehicleRightImage = req.files?.vehicleRightImage?.[0] ? {
    url: req.files.vehicleRightImage[0].path,
    filename: req.files.vehicleRightImage[0].filename
  } : null;

  const vehicleLeftImage = req.files?.vehicleLeftImage?.[0] ? {
    url: req.files.vehicleLeftImage[0].path,
    filename: req.files.vehicleLeftImage[0].filename
  } : null;

  const vehicleRegistrationBookFront = req.files?.vehicleRegistrationBookFront?.[0] ? {
    url: req.files.vehicleRegistrationBookFront[0].path,
    filename: req.files.vehicleRegistrationBookFront[0].filename
  } : null;

  if (!vehicleFrontImage || !vehicleBackImage || !vehicleRightImage || 
      !vehicleLeftImage || !vehicleRegistrationBookFront) {
    throw new BadRequestError('All vehicle images are required');
  }

  if (licensePlateNo) {
    const vehicleExists = await Vehicle.findOne({ licensePlateNo });
    if (vehicleExists) {
      throw new BadRequestError(
        "Vehicle with this license plate already exists"
      );
    }

    const vehiclePrefix = "RideV";
    const vehicleCount = await Vehicle.countDocuments();
    const vehicleNextNumber = vehicleCount + 1;
    const vehiclePaddedNumber = String(vehicleNextNumber).padStart(3, "0");
    const vehicleID = vehiclePrefix + vehiclePaddedNumber;

    const newVehicle = new Vehicle({
      vehicleID,
      model,
      vehicleType,
      color,
      year,
      owner,
      licensePlateNo,
      chassisNo,
      seat,
      vehicleFrontImage,
      vehicleBackImage,
      vehicleRightImage,
      vehicleLeftImage,
      vehicleRegistrationBookFront,
      driver: driverId,
      status: "pending",
    });

    if (driverId) {
      await Driver.findByIdAndUpdate(
        driverId,
        { assignedVehicle: newVehicle._id },
        { new: true }
      );
    }

    const savedVehicle = await newVehicle.save();
    res.status(201).json({ 
      success: true,
      vehicle: savedVehicle,
      message: "Vehicle created successfully" 
    });
  } else {
    throw new BadRequestError("License plate number is required");
  }
};

//Get all vehicles
const getAllVehicles = async (req, res, next) => {
  const vehicles = await Vehicle.find({})
    .populate("driver")
    .sort({ createdAt: -1 });

  if (!vehicles.length) {
    return next(new NotFoundError("Vehicles"));
  }

  res.status(200).json(vehicles);
};

//Get vehicle by ID
const getVehicleById = async (req, res, next) => {
  const { id } = req.params;
  const vehicle = await Vehicle.findById(id).populate("driver");

  if (!vehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json(vehicle);
};

//Update vehicle
const updateVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { 
    model, 
    vehicleType, 
    color, 
    year, 
    owner, 
    licensePlateNo, 
    chassisNo,
    seat,
    status 
  } = req.body;

  
  const updateData = { 
    model, 
    vehicleType, 
    color, 
    year, 
    owner, 
    licensePlateNo, 
    chassisNo,
    seat,
    status 
  };


  if (req.files) {
    if (req.files.vehicleFrontImage?.[0]) {
      updateData.vehicleFrontImage = {
        url: req.files.vehicleFrontImage[0].path,
        filename: req.files.vehicleFrontImage[0].filename
      };
    }
    
    if (req.files.vehicleBackImage?.[0]) {
      updateData.vehicleBackImage = {
        url: req.files.vehicleBackImage[0].path,
        filename: req.files.vehicleBackImage[0].filename
      };
    }
    
    if (req.files.vehicleRightImage?.[0]) {
      updateData.vehicleRightImage = {
        url: req.files.vehicleRightImage[0].path,
        filename: req.files.vehicleRightImage[0].filename
      };
    }
    
    if (req.files.vehicleLeftImage?.[0]) {
      updateData.vehicleLeftImage = {
        url: req.files.vehicleLeftImage[0].path,
        filename: req.files.vehicleLeftImage[0].filename
      };
    }
    
    if (req.files.vehicleRegistrationBookFront?.[0]) {
      updateData.vehicleRegistrationBookFront = {
        url: req.files.vehicleRegistrationBookFront[0].path,
        filename: req.files.vehicleRegistrationBookFront[0].filename
      };
    }
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!updatedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json({
    success: true,
    vehicle: updatedVehicle,
    message: "Vehicle updated successfully"
  });
};

//Delete vehicle
const deleteVehicle = async (req, res, next) => {
  const { id } = req.params;
  const deletedVehicle = await Vehicle.findByIdAndDelete(id);

  if (!deletedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json({ 
    success: true,
    message: "Vehicle deleted successfully" 
  });
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};