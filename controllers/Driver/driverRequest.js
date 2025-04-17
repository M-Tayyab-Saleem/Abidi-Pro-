const Driver = require("../../models/UserManagment/DriverSchema");
const { NotFoundError } = require("../../utils/ExpressError");
const Vehicle = require("../../models/UserManagment/VehicleSchema");


// PATCH/PUT: Create or Update a Driver
const createOrUpdateDriver = async (req, res) => {
  const { id } = req.params;
  const { driverDeclineReason, driverReSubmit } = req.body;

  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    { driverDeclineReason, driverReSubmit },
    { new: true }
  );

  if (!updatedDriver) {
    throw new NotFoundError("Driver");
  }

  res.json(updatedDriver);
};

// GET: All Driver Requests
const getAllDriverRequests = async (req, res) => {
  const drivers = await Driver.find({}).sort({ createdAt: -1 });
  res.status(200).json(drivers);
};

// GET: Single Driver Request by ID
const getDriverRequestById = async (req, res) => {
  const { id } = req.params;

  const driver = await Driver.findById(id).populate('assignedVehicle');
  if (!driver) {
    throw new NotFoundError("Driver");
  }

  res.status(200).json(driver);
};

module.exports = {
  createOrUpdateDriver,
  getAllDriverRequests,
  getDriverRequestById,
};
