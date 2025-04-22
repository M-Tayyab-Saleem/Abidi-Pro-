const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer  = require('multer')
const {storage}= require("../storageConfig");
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");

const {
  getAllDrivers,
  getDriverById,
} = require("../controllers/Driver/allDrivers");

const {
  createOrUpdateDriver, 
  getAllDriverRequests,
  getDriverRequestById,
} = require("../controllers/Driver/driverRequest");

const {
  createLog,
  createInfoLog,
  createErrorLog,
  createDebugLog,
  createWarnLog,
  getAllLogs,
} = require("../controllers/Logs/LogController");

const { post, get, getById } = require("../controllers/Trips/trips");

const {
  postAccountant,
  getAccountant,
  getAccountantById,
  updateAccountant,
  removeAccountant,
} = require("../controllers/UserManagment/accountant");

const {
  createDispatcher,
  getAllDispatchers,
  getDispatcherById,
  updateDispatcher,
  deleteDispatcher,
} = require("../controllers/UserManagment/dispatacher");

const {
  createDriver,
  getAllUserDrivers,
  getUserDriverById,
  updateDriverById,
  deleteDriverById,
  updateDeclineOrResubmit,
} = require("../controllers/UserManagment/userDriver");

const {
  createPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
} = require("../controllers/UserManagment/userPassenger");

const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/VehicleManagment/Vehicle");

const {
  getVehicleAvailability,
} = require("../controllers/VehicleManagment/VehicleAvailability");

const {
  getAllVehiclesDetails,
  getVehicleDetailsById,
  postDeclineOrResubmitVehicle,
} = require("../controllers/VehicleManagment/VehicleDetails");

const {
  createUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
} = require("../controllers/UserManagment/auth");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require("../controllers/UserManagment/User");

const {
  driverValidationSchema,
  driverUpdateSchema,
} = require("../JoiSchema/DriverJoiSchema");

const { vehicleValidateSchema } = require("../JoiSchema/VehicleJoiSchema");

const logValidationSchema = require("../JoiSchema/LogJoiSchema");
const {
  passengerSchema,
  passengerUpdateSchema,
} = require("../JoiSchema/PassengerJoiSchema");
const tripValidationSchema = require("../JoiSchema/TripsJoiSchema");
const {
  userSchema,
  userUpdateSchema,
} = require("../JoiSchema/UserJoiSchema");

const validateRequest = require("../middlewares/validateRequest");

// Driver Routes
router.get("/allDriver", isLoggedIn, catchAsync(getAllDrivers));
router.get("/allDriver/:id", isLoggedIn, catchAsync(getDriverById));

router.post("/driverRequest/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(createOrUpdateDriver));
router.get("/driverRequest", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllDriverRequests));
router.get("/driverRequest/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'), catchAsync(getDriverRequestById));

router.post("/driver-posting-entry", isLoggedIn, restrictTo('admin', 'dispatcher'), validateRequest(driverValidationSchema), catchAsync(createDriver));
router.get("/driver-getting-values", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllUserDrivers));
router.get("/driver-getting-values/:id", isLoggedIn,restrictTo('admin', 'dispatcher', 'driver'), catchAsync(getUserDriverById));
router.put("/driver-putting-values/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'), validateRequest(driverUpdateSchema), catchAsync(updateDriverById));
router.delete("/driver-deleting-values/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'), catchAsync(deleteDriverById));
router.post("/driver-posting-form/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(updateDeclineOrResubmit));
router.get("/driver-requestion-form", isLoggedIn, catchAsync(getAllDrivers));
router.get("/driver-requestion-form/:id", isLoggedIn, catchAsync(getDriverById));

// Log Routes
router.post("/log",  validateRequest(logValidationSchema), catchAsync(createLog));
router.post("/info",  validateRequest(logValidationSchema), catchAsync(createInfoLog));
router.post("/error",  validateRequest(logValidationSchema), catchAsync(createErrorLog));
router.post("/warn",  validateRequest(logValidationSchema), catchAsync(createWarnLog));
router.post("/debug",  validateRequest(logValidationSchema), catchAsync(createDebugLog));
router.get("/logs", catchAsync(getAllLogs));

// Trip Routes
router.post("/trips-posting-values", isLoggedIn, restrictTo('admin', 'dispatcher'), validateRequest(tripValidationSchema), catchAsync(post));
router.get("/trips-getting-values", isLoggedIn, catchAsync(get));
router.get("/trips-getting-values/:id", isLoggedIn, catchAsync(getById));

// Accountant Routes
router.post("/accountant", isLoggedIn, restrictTo('admin'), validateRequest(userSchema), catchAsync(postAccountant));
router.get("/accountant", isLoggedIn, restrictTo('admin', 'accountant'), catchAsync(getAccountant));
router.get("/accountant/:id", isLoggedIn, restrictTo('admin', 'accountant'), catchAsync(getAccountantById));
router.put("/accountant/:id", isLoggedIn, restrictTo('admin', 'accountant'), validateRequest(userUpdateSchema), catchAsync(updateAccountant));
router.delete("/accountant/:id", isLoggedIn, restrictTo('admin', 'accountant'), catchAsync(removeAccountant));

// Dispatcher Routes
router.post("/dispatcher", isLoggedIn, restrictTo('admin'), validateRequest(userSchema), catchAsync(createDispatcher));
router.get("/dispatcher", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllDispatchers));
router.get("/dispatcher/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getDispatcherById));
router.put("/dispatcher/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), validateRequest(userUpdateSchema), catchAsync(updateDispatcher));
router.delete("/dispatcher/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(deleteDispatcher));

// Passenger Routes
router.post("/createPassenger", isLoggedIn, restrictTo('admin', 'dispatcher'), upload.single('passengerImage'), catchAsync(createPassenger));
router.get("/createPassenger", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllPassengers));
router.get("/createPassenger/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'passenger'), catchAsync(getPassengerById));
router.put("/createPassenger/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'passenger'), validateRequest(passengerUpdateSchema), catchAsync(updatePassenger));
router.delete("/createPassenger/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'passenger'), catchAsync(deletePassenger));

// Vehicle Routes
router.post("/create-vehicle", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'), catchAsync(createVehicle));
router.get("/vehicle-get-values", isLoggedIn, catchAsync(getAllVehicles));
router.get("/vehicle-get-values/:id", isLoggedIn, catchAsync(getVehicleById));
router.put("/vehicle-put-values/:id", isLoggedIn, restrictTo('admin', 'dispatcher', 'driver' ), catchAsync(updateVehicle));
router.delete("/vehicle-delete-values/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(deleteVehicle));
router.get("/vehicle-availability-get-values", isLoggedIn, catchAsync(getVehicleAvailability));
router.get("/vehicle-details-get-values", isLoggedIn, catchAsync(getAllVehiclesDetails));
router.get("/vehicle-details-get-values/:id", isLoggedIn, catchAsync(getVehicleDetailsById));
router.post("/vehicle-details-post-request/:id", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(postDeclineOrResubmitVehicle));

// Auth Routes
// Public routes (no authentication needed)
router.post("/createuser", validateRequest(userSchema), catchAsync(createUser));
router.post("/signin", catchAsync(signIn));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/resend-otp", catchAsync(resendOtp));
router.put("/createuser/:id", isLoggedIn,  validateRequest(userUpdateSchema), catchAsync(updateUser));
router.delete("/createuser/:id", isLoggedIn,  catchAsync(deleteUser));
router.get("/createuser/:id", isLoggedIn, catchAsync(getUserById));

// Protected routes
router.get("/createuser", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllUsers));
router.post("/logout", isLoggedIn, catchAsync(logout));

module.exports = router;