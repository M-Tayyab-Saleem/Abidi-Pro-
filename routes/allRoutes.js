const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer  = require('multer')
const {storage}= require("../storageConfig");
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");



const {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest
} = require("./routes/leaveRequestRoutes");

//Leave Routes
router.post("/createLeave", catchAsync(createLeaveRequest));
router.get("/getAllLeaves", catchAsync(getLeaveRequests));
router.get("/getLeave/:id", catchAsync(getLeaveRequestById));
router.put("/updateLeave/:id", catchAsync(updateLeaveRequest));
router.delete("/deleteLeave/:id", catchAsync(deleteLeaveRequest));

module.exports = router;






// const {
//   createLog,
//   createInfoLog,
//   createErrorLog,
//   createDebugLog,
//   createWarnLog,
//   getAllLogs,
// } = require("../controllers/Logs/LogController");

// const {
//   createUser,
//   signIn,
//   verifyOtp,
//   resendOtp,
//   logout,
// } = require("../controllers/UserManagment/auth");


// const validateRequest = require("../middlewares/validateRequest");

// // Log Routes
// // router.post("/log",  validateRequest(logValidationSchema), catchAsync(createLog));
// // router.post("/info",  validateRequest(logValidationSchema), catchAsync(createInfoLog));
// // router.post("/error",  validateRequest(logValidationSchema), catchAsync(createErrorLog));
// // router.post("/warn",  validateRequest(logValidationSchema), catchAsync(createWarnLog));
// // router.post("/debug",  validateRequest(logValidationSchema), catchAsync(createDebugLog));
// router.get("/logs", catchAsync(getAllLogs));

// // Auth Routes
// // Public routes (no authentication needed)
// // router.post("/createuser", validateRequest(userSchema), catchAsync(createUser));
// router.post("/signin", catchAsync(signIn));
// router.post("/verify-otp", catchAsync(verifyOtp));
// router.post("/resend-otp", catchAsync(resendOtp));
// // router.put("/createuser/:id", isLoggedIn,  validateRequest(userUpdateSchema), catchAsync(updateUser));
// // router.delete("/createuser/:id", isLoggedIn,  catchAsync(deleteUser));
// // router.get("/createuser/:id", isLoggedIn, catchAsync(getUserById));

// // Protected routes
// // router.get("/createuser", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllUsers));
// router.post("/logout", isLoggedIn, catchAsync(logout));