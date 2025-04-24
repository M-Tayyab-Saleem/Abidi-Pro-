const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require('multer');
const { storage } = require("../../storageConfig");
const upload = multer({ storage });
const validateRequest = require("../../middlewares/validateRequest");

// Import controllers
const {
  createPassenger,
  getPassengerById,
  updatePassenger,
} = require("../../controllers/UserManagment/userPassenger");

// Import validation schemas
const {
  passengerUpdateSchema,
} = require("../../JoiSchema/PassengerJoiSchema");

// Passenger routes
router.route("/")
  .post( upload.single('passengerImage'), catchAsync(createPassenger));

router.route("/:id")
  .get( catchAsync(getPassengerById))
  .put( validateRequest(passengerUpdateSchema), catchAsync(updatePassenger));

module.exports = router;