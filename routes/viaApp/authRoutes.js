const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const validateRequest = require("../../middlewares/validateRequest");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { userSchema } = require("../../JoiSchema/UserJoiSchema");
const { resetPasswordSchema } = require("../../JoiSchema/resetPasswordSchema");

// Import controllers
const {
  createUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  refreshToken,
} = require("../../controllers/UserManagment/auth");

// Auth Routes - Public routes
router
  .route("/signup")
  .post(validateRequest(userSchema), catchAsync(createUser));

router.route("/signin").post(catchAsync(signIn));

router.route("/verify-otp").post(catchAsync(verifyOtp));

router.route("/resend-otp").post(catchAsync(resendOtp));

router.route("/logout").post(isLoggedIn, catchAsync(logout));

// Password reset routes
router.route("/forgot-password").post(catchAsync(forgotPassword));

router
  .route("/reset-password/:token")
  .post(validateRequest(resetPasswordSchema), catchAsync(resetPassword));

router.route("/verify-reset-token/:token").get(catchAsync(verifyResetToken));

router.route("/refresh-token").post(catchAsync(refreshToken));

module.exports = router;
