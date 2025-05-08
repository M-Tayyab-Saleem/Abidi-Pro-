const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require('multer');
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/authMiddleware");

// Import controllers
const {
  createUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
} = require("../controllers/UserManagment/auth");

const validateRequest = require("../middlewares/validateRequest");
const { forgotPassword, resetPassword, verifyResetToken } = require("../controllers/UserManagment/auth");
const { refreshToken } = require("../controllers/UserManagment/auth");



// Auth Routes - Public routes
// router.post("/signup", validateRequest(userSchema), catchAsync(createUser));
router.post("/signin", catchAsync(signIn));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/resend-otp", catchAsync(resendOtp));

// Auth Routes - Protected routes
// router.get("/user-profile/:id", isLoggedIn, catchAsync(getUserById));
router.post("/logout", isLoggedIn, catchAsync(logout));

// Forgot password routes
router.post("/forgot-password", catchAsync(forgotPassword));
// router.post("/reset-password/:token", validateRequest(resetPasswordSchema), catchAsync(resetPassword));
router.get("/verify-reset-token/:token", catchAsync(verifyResetToken));
router.post("/refresh-token", catchAsync(refreshToken));




module.exports = router;