const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const tripValidationSchema = require("../../JoiSchema/TripsJoiSchema");


const { 
  post, 
  get, 
  getById 
} = require("../../controllers/Trips/trips");

router.route("/")
  .post(/*isLoggedIn, restrictTo('admin', 'dispatcher'), validateRequest(tripValidationSchema),*/ catchAsync(post))
  .get(/*isLoggedIn,*/ catchAsync(get));

router.route("/:id")
  .get(/*isLoggedIn,*/ catchAsync(getById));

module.exports = router;