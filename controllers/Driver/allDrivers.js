const Driver = require("../../models/UserManagment/DriverSchema");
const { NotFoundError } = require("../../utils/ExpressError");

const getAllDrivers = async (req, res) => {
  const drivers = await Driver.find({})
    .populate("assignedVehicle")
    .sort({ createdAt: -1 });

  res.status(200).json(drivers);
};

const getDriverById = async (req, res) => {
  const { id } = req.params;

  const driver = await Driver.findById(id);

  if (!driver) {
    throw new NotFoundError("Driver");
  }

  res.status(200).json(driver);
};

module.exports = {
  getAllDrivers,
  getDriverById,
};
