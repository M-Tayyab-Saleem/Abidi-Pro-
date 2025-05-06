const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");

// Controllers
const {
  createUser,
  verifyOtp,
  resendOtp,
  refreshToken,
  getCurrentUser,
  logout, 
} = require("../../controllers/App/auth");

// App Auth Routes (OTP-based)
router.post("/signin", catchAsync(createUser));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/resend-otp", catchAsync(resendOtp));
router.post("/refresh-token", catchAsync(refreshToken));
router.get("/me", isLoggedIn, catchAsync(getCurrentUser));
router.post("/logout", isLoggedIn, catchAsync(logout));

module.exports = router;
