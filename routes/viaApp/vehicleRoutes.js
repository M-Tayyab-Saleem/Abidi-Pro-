const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require('multer');
const { vehicleDocsStorage } = require("../../storageConfig");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");

// Import controllers
const {
  createVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
} = require("../../controllers/VehicleManagment/Vehicle");

const {
  getVehicleAvailability,
} = require("../../controllers/VehicleManagment/VehicleAvailability");

// Import validation schemas
const { 
  vehicleValidateSchema, 
  vehicleUpdateValidate 
} = require("../../JoiSchema/VehicleJoiSchema");

// Configure multer for vehicle docs
const uploadVehicleDocs = multer({ 
  storage: vehicleDocsStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 2 // Maximum 2 files
  }
}).fields([
  { name: 'vehicleRegistrationBookFront', maxCount: 1 },
  { name: 'vehicleInsurance', maxCount: 1 }
]);

// Vehicle routes
router.route("/")
  .post(
    isLoggedIn, 
    restrictTo('admin', 'dispatcher', 'driver'), 
    uploadVehicleDocs, 
    validateRequest(vehicleValidateSchema), 
    catchAsync(createVehicle)
  )
  .get(isLoggedIn, catchAsync(getAllVehicles));

router.route("/:id")
  .get(isLoggedIn, catchAsync(getVehicleById))
  .put(
    isLoggedIn, 
    restrictTo('admin', 'dispatcher', 'driver'), 
    validateRequest(vehicleUpdateValidate), 
    catchAsync(updateVehicle)
  );

router.route("/availability")
  .get(isLoggedIn, catchAsync(getVehicleAvailability));

module.exports = router;