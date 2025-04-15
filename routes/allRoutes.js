const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer  = require('multer')
const {storage}= require("../storageConfig");
const upload = multer({ storage });

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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  signIn,
  verifyOtp,
  resendOtp,
} = require("../controllers/UserManagment/auth");

const {
  driverValidationSchema,
  driverUpdateSchema,
} = require("../JoiSchema/DriverJoiSchema");
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
router.get("/allDriver", catchAsync(getAllDrivers));
router.get("/allDriver/:id", catchAsync(getDriverById));

router.post("/driverRequest/:id", catchAsync(createOrUpdateDriver));
router.get("/driverRequest", catchAsync(getAllDriverRequests));
router.get("/driverRequest/:id", catchAsync(getDriverRequestById));

router.post("/driver-posting-entry", validateRequest(driverValidationSchema), catchAsync(createDriver));
router.get("/driver-getting-values", catchAsync(getAllUserDrivers));
router.get("/driver-getting-values/:id", catchAsync(getUserDriverById));
router.put("/driver-putting-values/:id", validateRequest(driverUpdateSchema), catchAsync(updateDriverById));
router.delete("/driver-deleting-values/:id", catchAsync(deleteDriverById));
router.post("/driver-posting-form/:id", catchAsync(updateDeclineOrResubmit));
router.get("/driver-requestion-form", catchAsync(getAllDrivers));
router.get("/driver-requestion-form/:id", catchAsync(getDriverById));

// Log Routes
router.post("/log", validateRequest(logValidationSchema), catchAsync(createLog));
router.post("/info", validateRequest(logValidationSchema), catchAsync(createInfoLog));
router.post("/error", validateRequest(logValidationSchema), catchAsync(createErrorLog));
router.post("/warn", validateRequest(logValidationSchema), catchAsync(createWarnLog));
router.post("/debug", validateRequest(logValidationSchema), catchAsync(createDebugLog));
router.get("/logs", catchAsync(getAllLogs));

// Trip Routes
router.post("/trips-posting-values", validateRequest(tripValidationSchema), catchAsync(post));
router.get("/trips-getting-values", catchAsync(get));
router.get("/trips-getting-values/:id", catchAsync(getById));

// Accountant Routes
router.post("/accountant", validateRequest(userSchema), catchAsync(postAccountant));
router.get("/accountant", catchAsync(getAccountant));
router.get("/accountant/:id", catchAsync(getAccountantById));
router.put("/accountant/:id", validateRequest(userUpdateSchema), catchAsync(updateAccountant));
router.delete("/accountant/:id", catchAsync(removeAccountant));

// Dispatcher Routes
router.post("/dispatcher", validateRequest(userSchema), catchAsync(createDispatcher));
router.get("/dispatcher", catchAsync(getAllDispatchers));
router.get("/dispatcher/:id", catchAsync(getDispatcherById));
router.put("/dispatcher/:id", validateRequest(userUpdateSchema), catchAsync(updateDispatcher));
router.delete("/dispatcher/:id", catchAsync(deleteDispatcher));

// Passenger Routes
router.post("/createPassenger", upload.single('passengerImage'), catchAsync(createPassenger));
// router.post("/createPassenger", validateRequest(passengerSchema), catchAsync(createPassenger));
router.get("/createPassenger", catchAsync(getAllPassengers));
router.get("/createPassenger/:id", catchAsync(getPassengerById));
router.put("/createPassenger/:id", validateRequest(passengerUpdateSchema), catchAsync(updatePassenger));
router.delete("/createPassenger/:id", catchAsync(deletePassenger));

// Vehicle Routes
router.get("/vehicle-get-values", catchAsync(getAllVehicles));
router.get("/vehicle-get-values/:id", catchAsync(getVehicleById));
router.put("/vehicle-put-values/:id", catchAsync(updateVehicle));
router.delete("/vehicle-delete-values/:id", catchAsync(deleteVehicle));

router.get("/vehicle-availability-get-values", catchAsync(getVehicleAvailability));

router.get("/vehicle-details-get-values", catchAsync(getAllVehiclesDetails));
router.get("/vehicle-details-get-values/:id", catchAsync(getVehicleDetailsById));
router.post("/vehicle-details-post-request/:id", catchAsync(postDeclineOrResubmitVehicle));

// Auth Routes
router.post("/createuser", validateRequest(userSchema), catchAsync(createUser));
router.get("/createuser", catchAsync(getAllUsers));
router.get("/createuser/:id", catchAsync(getUserById));
router.put("/createuser/:id", validateRequest(userUpdateSchema), catchAsync(updateUser));
router.delete("/createuser/:id", catchAsync(deleteUser));
router.post("/signin", catchAsync(signIn));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/resend-otp", catchAsync(resendOtp));

module.exports = router;
