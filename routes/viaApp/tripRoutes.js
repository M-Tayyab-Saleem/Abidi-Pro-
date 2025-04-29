const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const validateRequest = require("../../middlewares/validateRequest");

// Import controllers
const { 
  post, 
  get, 
  getById ,
  deleteById,
} = require("../../controllers/Trips/trips");

// Import validation schemas
const tripValidationSchema = require("../../JoiSchema/TripsJoiSchema");

// Trip routes
router.route("/")
  .post(/*isLoggedIn,*/ catchAsync(post))
  .get(catchAsync(get));

router.route("/:id")
  .get( catchAsync(getById))
  .delete( catchAsync(deleteById));

module.exports = router;