const Vehicle = require("../../models/UserManagment/VehicleSchema");
const Driver = require("../../models/UserManagment/DriverSchema");
const { NotFoundError, BadRequestError } = require("../../utils/ExpressError");

// Create vehicle
const createVehicle = async (req, res) => {
  const {
    driverId,
    make,
    carType,
    color,
    year,
    owner,
    licensePlateNo,
    feul,
    seat,
    transmission,
  } = req.body;

  // Process uploaded files
  const vehicleRegistrationBookFront = req.files?.vehicleRegistrationBookFront?.[0] ? {
    url: req.files.vehicleRegistrationBookFront[0].path,
    filename: req.files.vehicleRegistrationBookFront[0].filename
  } : null;

  const vehicleInsurance = req.files?.vehicleInsurance?.[0] ? {
    url: req.files.vehicleInsurance[0].path,
    filename: req.files.vehicleInsurance[0].filename
  } : null;

  // Validate required documents
  if (!vehicleRegistrationBookFront) {
    throw new BadRequestError('Vehicle registration book front image is required');
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
      make,
      carType,
      color,
      year,
      owner,
      licensePlateNo,
      feul,
      seat,
      transmission,
      vehicleRegistrationBookFront,
      vehicleInsurance,
      driver: driverId,
      status: "pending",
    });

    // Update driver's assigned vehicle if driverId provided
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
  const { make, carType, color, year, owner, licensePlateNo, feul } = req.body;

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { make, carType, color, year, owner, licensePlateNo, feul },
    { new: true }
  );

  if (!updatedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json(updatedVehicle);
};

//Delete vehicle
const deleteVehicle = async (req, res, next) => {
  const { id } = req.params;
  const deletedVehicle = await Vehicle.findByIdAndDelete(id);

  if (!deletedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json({ message: "Vehicle deleted successfully" });
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
