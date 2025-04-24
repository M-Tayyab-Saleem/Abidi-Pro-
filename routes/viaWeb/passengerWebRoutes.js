const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require('multer');
const { storage } = require("../../storageConfig");
const upload = multer({ storage });
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { passengerUpdateSchema } = require("../../JoiSchema/PassengerJoiSchema");


const {
  createPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
} = require("../../controllers/UserManagment/userPassenger");

router.route("/")
  .post(
    /*isLoggedIn, 
    restrictTo('admin', 'dispatcher'), */
    upload.single('passengerImage'), 
    catchAsync(createPassenger)
  )
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/ catchAsync(getAllPassengers));

router.route("/:id")
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'passenger'),*/ catchAsync(getPassengerById))
  .put(
    /*isLoggedIn, 
    restrictTo('admin', 'dispatcher', 'passenger'), 
    validateRequest(passengerUpdateSchema),*/ 
    catchAsync(updatePassenger)
  )
  .delete(/*isLoggedIn, restrictTo('admin', 'dispatcher', 'passenger'),*/ catchAsync(deletePassenger));

module.exports = router;