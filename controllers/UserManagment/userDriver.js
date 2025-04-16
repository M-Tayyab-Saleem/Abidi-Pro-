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
    driverBirthDate,
  } = req.body;

  // Check if driver already exists
  const driverExists = await Driver.findOne({ 
    $or: [
      { driverContact },
      { driverCnic },
      { driverEmail }
    ]
  });
  if (driverExists) {
    throw new BadRequestError('Driver with these details already exists');
  }

  // Generate driver ID
  const prefix = "RideDr";
  const count = await Driver.countDocuments();
  const nextNumber = count + 1;
  const paddedNumber = String(nextNumber).padStart(3, "0");
  const driverID = prefix + paddedNumber;

  // Process uploaded files
  const driverProfilePic = req.files?.driverProfilePic?.[0] ? {
    url: req.files.driverProfilePic[0].path,
    filename: req.files.driverProfilePic[0].filename
  } : null;

  const driverCnicPicFront = req.files?.driverCnicPicFront?.[0] ? {
    url: req.files.driverCnicPicFront[0].path,
    filename: req.files.driverCnicPicFront[0].filename
  } : null;

  const driverCnicPicBack = req.files?.driverCnicPicBack?.[0] ? {
    url: req.files.driverCnicPicBack[0].path,
    filename: req.files.driverCnicPicBack[0].filename
  } : null;

  const driverLicensePicFront = req.files?.driverLicensePicFront?.[0] ? {
    url: req.files.driverLicensePicFront[0].path,
    filename: req.files.driverLicensePicFront[0].filename
  } : null;

  const driverLicensePicBack = req.files?.driverLicensePicBack?.[0] ? {
    url: req.files.driverLicensePicBack[0].path,
    filename: req.files.driverLicensePicBack[0].filename
  } : null;


  // Validate required documents
  if (!driverCnicPicFront || !driverCnicPicBack || !driverLicensePicFront || !driverLicensePicBack) {
    throw new BadRequestError('All required documents (CNIC front/back, License front/back) must be uploaded');
  }

  // Create new driver
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
    driverBirthDate,
    driverProfilePic,
    driverCnicPicFront,
    driverCnicPicBack,
    driverLicensePicFront,
    driverLicensePicBack,
    status: 'pending' 
  });

  const savedDriver = await newDriver.save();
  res.status(201).json({ 
    success: true,
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