const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { driverValidationSchema, driverUpdateSchema } = require("../../JoiSchema/DriverJoiSchema");


const {
  getAllDrivers,
  getDriverById,
} = require("../../controllers/Driver/allDrivers");

const {
  createOrUpdateDriver, 
  getAllDriverRequests,
  getDriverRequestById,
} = require("../../controllers/Driver/driverRequest");

const {
  createDriver,
  getAllUserDrivers,
  getUserDriverById,
  updateDriverById,
  deleteDriverById,
  updateDeclineOrResubmit,
  approveDriver,
} = require("../../controllers/UserManagment/userDriver");


router.route("/all")
  .get(/*isLoggedIn,*/  catchAsync(getAllDrivers));

router.route("/all/:id")
  .get(/*isLoggedIn,*/  catchAsync(getDriverById));


router.route("/requests")
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/  catchAsync(getAllDriverRequests));

router.route("/requests/:id")
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'),*/  catchAsync(getDriverRequestById))
  .post(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/  catchAsync(createOrUpdateDriver));


router.route("/")
  .post(
    /*isLoggedIn, 
    restrictTo('admin', 'dispatcher'), 
    validateRequest(driverValidationSchema),*/ 
    catchAsync(createDriver)
  )
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/ catchAsync(getAllUserDrivers));


  router.patch("/approve/:id", catchAsync(approveDriver));


router.route("/:id")
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'),*/ catchAsync(getUserDriverById))
  .put(
    /*isLoggedIn, 
    restrictTo('admin', 'dispatcher', 'driver'), 
    validateRequest(driverUpdateSchema), */
    catchAsync(updateDriverById)
  )
  .delete(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'driver'),*/ catchAsync(deleteDriverById));


router.route("/status/:id")
  .post(/*isLoggedIn, restrictTo('admin', 'dispatcher'), */catchAsync(updateDeclineOrResubmit));

module.exports = router;