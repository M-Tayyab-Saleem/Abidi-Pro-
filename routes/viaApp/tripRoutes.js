const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const validateRequest = require("../../middlewares/validateRequest");

// Import controllers
const { 
  post, 
  get, 
  getById 
} = require("../../controllers/Trips/trips");

// Import validation schemas
const tripValidationSchema = require("../../JoiSchema/TripsJoiSchema");

// Trip routes
router.route("/")
  .post(isLoggedIn, validateRequest(tripValidationSchema), catchAsync(post))
  .get(isLoggedIn, catchAsync(get));

router.route("/:id")
  .get(isLoggedIn, catchAsync(getById));

module.exports = router;