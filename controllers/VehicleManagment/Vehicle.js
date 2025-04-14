const Vehicle = require("../../models/UserManagment/VehicleSchema");
const { NotFoundError, BadRequestError } = require("../../utils/ExpressError"); 
const getAllVehicles = async (req, res, next) => {
  const vehicles = await Vehicle.find({}).populate("driver").sort({ createdAt: -1 });
  
  if (!vehicles.length) {
    return next(new NotFoundError("Vehicles"));
  }

  res.status(200).json(vehicles);
};

const getVehicleById = async (req, res, next) => {
  const { id } = req.params;
  const vehicle = await Vehicle.findById(id).populate("driver");

  if (!vehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json(vehicle);
};

const updateVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { make, carType, color, year, owner, licensePlateNo, fuel } = req.body;

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { make, carType, color, year, owner, licensePlateNo, fuel },
    { new: true }
  );

  if (!updatedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json(updatedVehicle);
};

const deleteVehicle = async (req, res, next) => {
  const { id } = req.params;
  const deletedVehicle = await Vehicle.findByIdAndDelete(id);

  if (!deletedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json({ message: "Vehicle deleted successfully" });
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
