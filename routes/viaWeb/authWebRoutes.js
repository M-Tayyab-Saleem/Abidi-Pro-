const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { userSchema } = require("../../JoiSchema/UserJoiSchema");

// Import controllers
const {
  createUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
} = require("../../controllers/UserManagment/auth");

// Auth routes - Public routes
router.route("/signup")
  .post(validateRequest(userSchema), catchAsync(createUser));

router.route("/signin")
  .post(catchAsync(signIn));

router.route("/verify-otp")
  .post(catchAsync(verifyOtp));

router.route("/resend-otp")
  .post(catchAsync(resendOtp));

// Auth routes - Protected routes
router.route("/logout")
  .post(isLoggedIn, catchAsync(logout));

module.exports = router;