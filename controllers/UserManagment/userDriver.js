const Driver = require("../../models/UserManagment/DriverSchema");
const Vehicle = require("../../models/UserManagment/VehicleSchema");
const { NotFoundError, BadRequestError } = require('../../utils/ExpressError');

const createDriver = async (req, res) => {
  const {
    driverName,
    driverContact,
    driverEarning,
    driverJoiningDate,
    driverAge,
    driverGender,
    driverRating,
    driverCnic,
    driverCardNumber,
    driverTotalTrips,
    driverEmail,
    driverCity,
    driverBankName,
    driverIban,
    make,
    carType,
    color,
    year,
    owner,
    licensePlateNo,
    feul,
    seat,
    transmission
  } = req.body;

  const driverExists = await Driver.findOne({ driverContact });
  if (driverExists) {
    throw new BadRequestError('Driver with this contact number already exists');
  }

  const prefix = "RideDr";
  const count = await Driver.countDocuments();
  const nextNumber = count + 1;
  const paddedNumber = String(nextNumber).padStart(3, "0");
  const driverID = prefix + paddedNumber;

  const newDriver = new Driver({
    driverID,
    driverName,
    driverContact,
    driverEarning,
    driverJoiningDate,
    driverAge,
    driverGender,
    driverRating,
    driverCnic,
    driverCardNumber,
    driverTotalTrips,
    driverEmail,
    driverCity,
    driverBankName,
    driverIban,
  });

  const savedDriver = await newDriver.save();

  if (licensePlateNo) {
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
      driver: savedDriver._id
    });

    const savedVehicle = await newVehicle.save();
    savedDriver.assignedVehicle = savedVehicle._id;
    await savedDriver.save();
  }

  res.status(201).json({ 
    driver: savedDriver,
    message: "Driver created successfully" 
  });
};

const getAllUserDrivers = async (req, res) => {
  const drivers = await Driver.find({}).populate('assignedVehicle').sort({ createdAt: -1 });
  res.status(200).json(drivers);
};

const getUserDriverById = async (req, res) => {
  const { id } = req.params;
  const driver = await Driver.findById(id).populate('assignedVehicle');
  if (!driver) throw new NotFoundError('User');
  res.status(200).json(driver);
};

const updateDriverById = async (req, res) => {
  const { id } = req.params;
  const {
    driverID,
    driverName,
    driverContact,
    driverAge,
    driverCnic,
    driverCardNumber,
  } = req.body;

  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    {
      driverID,
      driverName,
      driverContact,
      driverAge,
      driverCnic,
      driverCardNumber,
    },
    { new: true }
  );
  
  if (!updatedDriver) throw new NotFoundError('Driver');
  res.json(updatedDriver);
};

const deleteDriverById = async (req, res) => {
  const { id } = req.params;
  await Driver.findByIdAndDelete(id);
  res.json({ message: "Driver Deleted Successfully" });
};

const updateDeclineOrResubmit = async (req, res) => {
  const { id } = req.params;
  const { driverDeclineReason, driverReSubmit } = req.body;

  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    { driverDeclineReason, driverReSubmit },
    { new: true }
  );
  
  if (!updatedDriver) throw new NotFoundError('Driver');
  res.json(updatedDriver);
};

module.exports = {
  createDriver,
  getAllUserDrivers,
  getUserDriverById,
  updateDriverById,
  deleteDriverById,
  updateDeclineOrResubmit,
};