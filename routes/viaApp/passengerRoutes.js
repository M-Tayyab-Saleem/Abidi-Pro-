const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require('multer');
const { storage } = require("../../storageConfig");
const upload = multer({ storage });
const { isLoggedIn } = require("../../middlewares/authMiddleware");
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
  .post(isLoggedIn, upload.single('passengerImage'), catchAsync(createPassenger));

router.route("/:id")
  .get(isLoggedIn, catchAsync(getPassengerById))
  .put(isLoggedIn, validateRequest(passengerUpdateSchema), catchAsync(updatePassenger));

module.exports = router;