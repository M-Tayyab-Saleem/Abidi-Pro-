const express = require("express");
const router = express.Router();
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

/////////////////////////////////////////////----ALL FILE ROUTES----////////////////////////////////////////////////

router.get("/allDriver", getAllDrivers);
router.get("/allDriver/:id", getDriverById);

router.post("/driverRequest/:id", createOrUpdateDriver);
router.get("/driverRequest", getAllDriverRequests);
router.get("/driverRequest/:id", getDriverRequestById);

router.post("/log", createLog);
router.post("/info", createInfoLog);
router.post("/error", createErrorLog);
router.get("/logs", getAllLogs);

router.post("/trips-posting-values", post);
router.get("/trips-getting-values", get);
router.get("/trips-getting-values/:id", getById);

router.post("/accountant", postAccountant);
router.get("/accountant", getAccountant);
router.get("/accountant/:id", getAccountantById);
router.put("/accountant/:id", updateAccountant);
router.delete("/accountant/:id", removeAccountant);

router.post("/dispatcher", createDispatcher);
router.get("/dispatcher", getAllDispatchers);
router.get("/dispatcher/:id", getDispatcherById);
router.put("/dispatcher/:id", updateDispatcher);
router.delete("/dispatcher/:id", deleteDispatcher);

router.post("/driver-posting-entry", createDriver);
router.get("/driver-getting-values", getAllUserDrivers);
router.get("/driver-getting-values/:id", getUserDriverById);
router.put("/driver-putting-values/:id", updateDriverById);
router.delete("/driver-deleting-values/:id", deleteDriverById);
router.post("/driver-posting-form/:id", updateDeclineOrResubmit);
router.get("/driver-requestion-form", getAllDrivers);
router.get("/driver-requestion-form/:id", getDriverById);

router.post("/createPassenger", createPassenger);
router.get("/createPassenger", getAllPassengers);
router.get("/createPassenger/:id", getPassengerById);
router.put("/createPassenger/:id", updatePassenger);
router.delete("/createPassenger/:id", deletePassenger);

router.get("/vehicle-get-values", getAllVehicles);
router.get("/vehicle-get-values/:id", getVehicleById);
router.put("/vehicle-put-values/:id", updateVehicle);
router.delete("/vehicle-delete-values/:id", deleteVehicle);

router.get("/vehicle-availability-get-values", getVehicleAvailability);

router.get("/vehicle-details-get-values", getAllVehiclesDetails);
router.get("/vehicle-details-get-values/:id", getVehicleDetailsById);
router.post("/vehicle-details-post-request/:id", postDeclineOrResubmitVehicle);

router.post("/createuser", createUser);
router.get("/createuser", getAllUsers);
router.get("/createuser/:id", getUserById);
router.put("/createuser/:id", updateUser);
router.delete("/createuser/:id", deleteUser);
router.post("/signin", signIn);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
