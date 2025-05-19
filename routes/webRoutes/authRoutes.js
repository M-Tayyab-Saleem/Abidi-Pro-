const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");


const authController = require("../../controllers/authController");
const validateRequest = require("../../middlewares/validateRequest");

// Auth Routes
router.post("/login", catchAsync(authController.login));
router.post("/verify-otp", catchAsync(authController.verifyOtp));
router.post("/resend-otp", catchAsync(authController.resendOtp));
router.post("/logout",  catchAsync(authController.logout));
router.get("/me", catchAsync(authController.getCurrentUser));

// Forgot password routes
router.post("/forgot-password", catchAsync(authController.forgotPassword));
router.get("/verify-reset-token/:token", catchAsync(authController.verifyResetToken));
router.post("/reset-password/:token", catchAsync(authController.resetPassword));









// router.post("/verify-otp", catchAsync(verifyOtp));
// router.post("/resend-otp", catchAsync(resendOtp));

// // Auth Routes - Protected routes
// // router.get("/user-profile/:id", isLoggedIn, catchAsync(getUserById));
// router.post("/logout", isLoggedIn, catchAsync(logout));

// // Forgot password routes
// router.post("/forgot-password", catchAsync(forgotPassword));
// // router.post("/reset-password/:token", validateRequest(resetPasswordSchema), catchAsync(resetPassword));
// router.get("/verify-reset-token/:token", catchAsync(verifyResetToken));
// router.post("/refresh-token", catchAsync(refreshToken));




module.exports = router;