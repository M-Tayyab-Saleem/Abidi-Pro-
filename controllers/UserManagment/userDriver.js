const Driver = require("../../models/UserManagment/DriverSchema");
const Vehicle = require("../../models/UserManagment/VehicleSchema");
const { NotFoundError, BadRequestError } = require('../../utils/ExpressError');
const getCurrentDate = require('../../utils/getCurrentDate');


function getAgeFromDOB(dob) {
  const [day, month, year] = dob.split("-").map(Number);

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
}

const createDriver = async (req, res) => {
  const {
    driverName,
    driverContact,
    driverEarning,
    driverGender,
    driverRating,
    driverCnic,
    driverLicenseNumber,
    driverAccountNumber,
    driverTotalTrips,
    driverEmail,
    driverBankName,
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
  if (!driverProfilePic || !driverCnicPicFront || !driverCnicPicBack || !driverLicensePicFront || !driverLicensePicBack) {
    throw new BadRequestError('All required documents (Image, CNIC front/back, License front/back) must be uploaded');
  }

  const driverJoiningDate = getCurrentDate(); 
  const driverAge = getAgeFromDOB(driverBirthDate);

  // Create new driver
  const newDriver = new Driver({
    driverName,
    driverContact,
    driverEarning,
    driverJoiningDate,
    driverAge,
    driverGender,
    driverRating,
    driverCnic,
    driverLicenseNumber,
    driverAccountNumber,
    driverTotalTrips,
    driverEmail,
    driverBankName,
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
    driverAccountNumber,
    driverLicenseNumber
  } = req.body;

  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    {
      driverID,
      driverName,
      driverContact,
      driverAge,
      driverCnic,
      driverAccountNumber,
      driverLicenseNumber
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

//
const updateDeclineOrResubmit = async (req, res) => {
  const { id } = req.params;
  const { 
    driverDeclineReason, 
    driverDeclinedDocuments = [] 
  } = req.body;

  if (!driverDeclineReason) {
    throw new BadRequestError('Decline reason is required');
  }

  const allDocumentFields = [
    'driverProfilePic',
    'driverCnicPicFront',
    'driverCnicPicBack',
    'driverLicensePicFront',
    'driverLicensePicBack'
  ];

  const approvedDocuments = allDocumentFields.filter(
    docField => !driverDeclinedDocuments.includes(docField)
  );

  const updateData = {
    driverDeclineReason,
    status: 'rejected',
    driverDeclinedDocuments: driverDeclinedDocuments,
    driverApprovedDocuments: approvedDocuments
  };

  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
  
  if (!updatedDriver) throw new NotFoundError('Driver');
  
  res.status(200).json({
    success: true,
    driver: updatedDriver,
    message: "Driver declined successfully with document status updated"
  });
};

// Approve driver
const approveDriver = async (req, res) => {
  const { id } = req.params;

  const driver = await Driver.findById(id);
  if (!driver) throw new NotFoundError('Driver not found');

  if (driver.status !== 'pending') {
    throw new BadRequestError('Only pending drivers can be approved');
  }

  const prefix = "RideDr";
  const count = await Driver.countDocuments({ driverID: { $ne: null } });
  const nextNumber = count + 1;
  const paddedNumber = String(nextNumber).padStart(3, "0");
  const driverID = prefix + paddedNumber;

  driver.status = 'approved';
  driver.driverID = driverID;

  const updatedDriver = await driver.save();

  res.status(200).json({
    success: true,
    driver: updatedDriver,
    message: "Driver approved successfully"
  });
};

module.exports = {
  createDriver,
  getAllUserDrivers,
  getUserDriverById,
  updateDriverById,
  deleteDriverById,
  updateDeclineOrResubmit,
  approveDriver,
};