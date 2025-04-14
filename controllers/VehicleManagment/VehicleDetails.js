const Vehicle = require("../../models/UserManagment/VehicleSchema");
const { NotFoundError, BadRequestError } = require("../../utils/ExpressError"); 

const getAllVehiclesDetails = async (req, res, next) => {
  const vehicles = await Vehicle.find({}).populate('driver').sort({ createdAt: -1 });

  if (!vehicles.length) {
    return next(new NotFoundError("Vehicles"));
  }

  res.status(200).json(vehicles);
};

const getVehicleDetailsById = async (req, res, next) => {
  const { id } = req.params;
  const vehicle = await Vehicle.findById(id).populate('driver');

  if (!vehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json(vehicle);
};

const postDeclineOrResubmitVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { vehicleDeclineReason, vehicleReSubmit } = req.body;

  if (!vehicleDeclineReason || !vehicleReSubmit) {
    return next(new BadRequestError("Decline reason and resubmit status are required"));
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { vehicleDeclineReason, vehicleReSubmit },
    { new: true }
  );

  if (!updatedVehicle) {
    return next(new NotFoundError("Vehicle"));
  }

  res.status(200).json(updatedVehicle);
};

module.exports = {
  getAllVehiclesDetails,
  getVehicleDetailsById,
  postDeclineOrResubmitVehicle,
};
