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


const postDeclineVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { 
    vehicleDeclineReason, 
    vehicleDeclinedDocuments = []
  } = req.body;

  if (!vehicleDeclineReason) {
    return next(new BadRequestError("Decline reason is required"));
  }

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return next(new NotFoundError("Vehicle Not Found"));
  }

  
  const allDocumentFields = [
    'vehicleFrontImage',
    'vehicleBackImage',
    'vehicleRightImage',
    'vehicleLeftImage',
    'vehicleRegistrationBookFront'
  ];

  const approvedDocuments = allDocumentFields.filter(
    docField => !vehicleDeclinedDocuments.includes(docField)
  );

  const updateData = {
    vehicleDeclineReason,
    vehicleDeclinedDocuments: vehicleDeclinedDocuments,
    vehicleApprovedDocuments: approvedDocuments,
    status: 'rejected'
  };

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  res.status(200).json({
    success: true,
    vehicle: updatedVehicle,
    message: "Vehicle declined successfully with document status updated"
  });
};

module.exports = {
  getAllVehiclesDetails,
  getVehicleDetailsById,
  postDeclineVehicle,
};
