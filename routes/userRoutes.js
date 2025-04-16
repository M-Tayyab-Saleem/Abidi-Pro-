const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require('multer');
const { storage, driverDocsStorage , vehicleDocsStorage } = require("../storageConfig");
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");


// Import controllers
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
} = require("../controllers/UserManagment/auth");

const {
  createVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
} = require("../controllers/VehicleManagment/Vehicle");

const {
  getVehicleAvailability,
} = require("../controllers/VehicleManagment/VehicleAvailability");

const { 
  post, 
  get, 
  getById 
} = require("../controllers/Trips/trips");

const {
  createPassenger,
  getPassengerById,
  updatePassenger,
} = require("../controllers/UserManagment/userPassenger");

const {
  createDriver,
  getUserDriverById,
  updateDriverById,
} = require("../controllers/UserManagment/userDriver");

// Import validation schemas
const {
  userSchema,
  userUpdateSchema,
} = require("../JoiSchema/UserJoiSchema");

const {
  passengerUpdateSchema,
} = require("../JoiSchema/PassengerJoiSchema");

const {
  driverValidationSchema,
  driverUpdateSchema,
} = require("../JoiSchema/DriverJoiSchema");

const tripValidationSchema = require("../JoiSchema/TripsJoiSchema");
const validateRequest = require("../middlewares/validateRequest");
const { vehicleValidateSchema,
  vehicleUpdateValidate } = require("../JoiSchema/VehicleJoiSchema");



const uploadDriverFiles =multer({
  storage: driverDocsStorage,
  limits: {
      fileSize: 5 * 1024 * 1024, // 5MB per file
      files: 5 // Maximum 5 files
  }}).fields([
  { name: 'driverProfilePic', maxCount: 1 },
  { name: 'driverCnicPicFront', maxCount: 1 },
  { name: 'driverCnicPicBack', maxCount: 1 },
  { name: 'driverLicensePicFront', maxCount: 1 },
  { name: 'driverLicensePicBack', maxCount: 1 }
]);

const uploadVehicleDocs = multer({ 
  storage: vehicleDocsStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 2 // Maximum 2 files (for the 2 fields)
  }
}).fields([
  { name: 'vehicleRegistrationBookFront', maxCount: 1 },
  { name: 'vehicleInsurance', maxCount: 1 }
]);


// Auth Routes - Public routes
router.post("/signup", validateRequest(userSchema), catchAsync(createUser));
router.post("/signin", catchAsync(signIn));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/resend-otp", catchAsync(resendOtp));

// Auth Routes - Protected routes
router.get("/user-profile/:id", isLoggedIn, catchAsync(getUserById));
router.put("/user-profile/:id", isLoggedIn, validateRequest(userUpdateSchema), catchAsync(updateUser));
router.delete("/user-profile/:id", isLoggedIn, catchAsync(deleteUser));
router.post("/logout", isLoggedIn, catchAsync(logout));

// Passenger Routes
router.post("/passenger-profile", isLoggedIn, upload.single('passengerImage'), catchAsync(createPassenger));
router.get("/passenger-profile/:id", isLoggedIn, catchAsync(getPassengerById));
router.put("/passenger-profile/:id", isLoggedIn, validateRequest(passengerUpdateSchema), catchAsync(updatePassenger));

// Driver Routes (for driver users)
router.post("/driver-posting-entry", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'), uploadDriverFiles, validateRequest(driverValidationSchema), catchAsync(createDriver));
router.get("/driver-profile/:id", isLoggedIn, catchAsync(getUserDriverById));
router.put("/driver-profile/:id", isLoggedIn, validateRequest(driverUpdateSchema), catchAsync(updateDriverById));

// Trip Routes
router.post("/book-trip", isLoggedIn, validateRequest(tripValidationSchema), catchAsync(post));
router.get("/trips", isLoggedIn, catchAsync(get));
router.get("/trips/:id", isLoggedIn, catchAsync(getById));

// Vehicle Routes
router.post("/create-vehicle", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'), uploadVehicleDocs, validateRequest(vehicleValidateSchema), catchAsync(createVehicle));
router.put("/vehicle-put-values/:id", isLoggedIn, restrictTo('admin', 'dispatcher' , "driver" ), validateRequest(vehicleUpdateValidate), catchAsync(updateVehicle));
router.get("/available-vehicles", isLoggedIn, catchAsync(getAllVehicles));
router.get("/vehicle/:id", isLoggedIn, catchAsync(getVehicleById));
router.get("/vehicle-availability", isLoggedIn, catchAsync(getVehicleAvailability));

module.exports = router;