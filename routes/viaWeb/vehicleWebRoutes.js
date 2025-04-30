const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { vehicleValidateSchema } = require("../../JoiSchema/VehicleJoiSchema");


const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../../controllers/VehicleManagment/Vehicle");

const {
  getVehicleAvailability,
} = require("../../controllers/VehicleManagment/VehicleAvailability");

const {
  getAllVehiclesDetails,
  getVehicleDetailsById,
  postDeclineVehicle,
} = require("../../controllers/VehicleManagment/VehicleDetails");


router.route("/")
  .post(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'),*/ catchAsync(createVehicle))
  .get(/*isLoggedIn,*/ catchAsync(getAllVehicles));

router.route("/availability")
  .get(/*isLoggedIn,*/ catchAsync(getVehicleAvailability));

router.route("/:id")
  .get(/*isLoggedIn,*/ catchAsync(getVehicleById))
  .put(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'),*/ catchAsync(updateVehicle))
  .delete(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/ catchAsync(deleteVehicle));


router.route("/details")
  .get(/*isLoggedIn,*/ catchAsync(getAllVehiclesDetails));

router.route("/details/:id")
  .get(/*isLoggedIn,*/ catchAsync(getVehicleDetailsById));

router.route("/status/:id")
  .post(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/ catchAsync(postDeclineVehicle));

module.exports = router;