const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer  = require('multer')
const {storage}= require("../storageConfig");
const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");


const {
  createLog,
  createInfoLog,
  createErrorLog,
  createDebugLog,
  createWarnLog,
  getAllLogs,
} = require("../controllers/Logs/LogController");

const {
  createUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
} = require("../controllers/UserManagment/auth");

// const { 
//   markAttendance, 
//   getAttendanceByDate, 
//   getAttendanceForUser,
// } = require("../controllers/attendance/attendance");

const { 
  createLeave, 
  getAllLeaves, 
  getLeaveById, 
  updateLeaveStatus, 
  deleteLeave,
} = require("../controllers/leave/leaveRequest");

const validateRequest = require("../middlewares/validateRequest");

// Log Routes
// router.post("/log",  validateRequest(logValidationSchema), catchAsync(createLog));
// router.post("/info",  validateRequest(logValidationSchema), catchAsync(createInfoLog));
// router.post("/error",  validateRequest(logValidationSchema), catchAsync(createErrorLog));
// router.post("/warn",  validateRequest(logValidationSchema), catchAsync(createWarnLog));
// router.post("/debug",  validateRequest(logValidationSchema), catchAsync(createDebugLog));
// router.get("/logs", catchAsync(getAllLogs));

// Auth Routes
// Public routes (no authentication needed)
// router.post("/createuser", validateRequest(userSchema), catchAsync(createUser));
router.post("/signin", catchAsync(signIn));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/resend-otp", catchAsync(resendOtp));
// router.put("/createuser/:id", isLoggedIn,  validateRequest(userUpdateSchema), catchAsync(updateUser));
// router.delete("/createuser/:id", isLoggedIn,  catchAsync(deleteUser));
// router.get("/createuser/:id", isLoggedIn, catchAsync(getUserById));

// Protected routes
// router.get("/createuser", isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllUsers));
router.post("/logout", isLoggedIn, catchAsync(logout));

// Attendance Routes
router.post("/", isLoggedIn, markAttendance);                       
router.get("/date/:date", isLoggedIn, getAttendanceByDate);         
router.get("/user/:id", isLoggedIn, getAttendanceForUser); 

//Leave Routes
router.post("/", createLeave);                   
router.get("/", getAllLeaves);                   
router.get("/:id", getLeaveById);                 
router.patch("/:id", updateLeaveStatus);          
router.delete("/:id",  deleteLeave); 


module.exports = router;