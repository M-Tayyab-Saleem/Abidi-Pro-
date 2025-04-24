const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require('multer');
const { driverDocsStorage } = require("../../storageConfig");
const validateRequest = require("../../middlewares/validateRequest");

// Import controllers
const {
  createDriver,
  getUserDriverById,
  updateDriverById,
  deleteDriverById,
} = require("../../controllers/UserManagment/userDriver");

// Import validation schemas
const {
  driverValidationSchema,
  driverUpdateSchema,
} = require("../../JoiSchema/DriverJoiSchema");

// Configure multer for driver docs
const uploadDriverFiles = multer({
  storage: driverDocsStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5 // Maximum 5 files
  }
}).fields([
  { name: 'driverProfilePic', maxCount: 1 },
  { name: 'driverCnicPicFront', maxCount: 1 },
  { name: 'driverCnicPicBack', maxCount: 1 },
  { name: 'driverLicensePicFront', maxCount: 1 },
  { name: 'driverLicensePicBack', maxCount: 1 }
]);

// Driver routes
router.route("/")
  .post(
    uploadDriverFiles, 
    validateRequest(driverValidationSchema), 
    catchAsync(createDriver)
  );

router.route("/:id")
  .get( catchAsync(getUserDriverById))
  .put( validateRequest(driverUpdateSchema), catchAsync(updateDriverById))
  .delete( catchAsync(deleteDriverById));


module.exports = router;