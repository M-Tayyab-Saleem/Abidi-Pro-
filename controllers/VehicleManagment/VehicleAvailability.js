const Vehicle = require("../../models/UserManagment/VehicleSchema");
const { NotFoundError } = require("../../utils/ExpressError"); 

const getVehicleAvailability = async (req, res, next) => {
  const vehicles = await Vehicle.find({}).populate("driver").sort({ createdAt: -1 });

  if (!vehicles.length) {
    return next(new NotFoundError("Vehicles"));
  }

  res.status(200).json(vehicles);
};

module.exports = {
  getVehicleAvailability,
};
