const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer  = require('multer')
const {storage}= require("../storageConfig");
// const upload = multer({ storage });
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");



const {
  createLeaveRequest,
  getLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest
} = require("../controllers/leaveRequest");
const companyModal = require("../models/companyModel");
const UserSchema = require("../models/UserSchema");
const { registerCompany } = require("../controllers/registerCompany");
const { registerUser } = require("../controllers/registerUser");
const { checkInn, checkOut, getAttendanceById, getAllAttendanceByCompany, getEmployeeAttendanceWeekly } = require("../controllers/checkInn");

//Leave Routes
router.post("/createLeave", catchAsync(createLeaveRequest));
router.get("/getAllLeaves", catchAsync(getLeaveRequests));
router.get("/getLeave/:id", catchAsync(getLeaveRequestById));
router.put("/updateLeave/:id", catchAsync(updateLeaveRequest));
router.delete("/deleteLeave/:id", catchAsync(deleteLeaveRequest));

// router.post("/createAttendance", catchAsync(createAttendence));
router.get("/getAllAttendance", catchAsync(getLeaveRequests));
router.get("/getAttendance/:id", catchAsync(getLeaveRequestById));
router.put("/updateAttendance/:id", catchAsync(updateLeaveRequest));
router.delete("/deleteAttendance/:id", catchAsync(deleteLeaveRequest));


// company register
router.post('/company/register', catchAsync(registerCompany));

// POST /user/register
router.post('/user/register',catchAsync(registerUser));

// POST /attendance/checkin/:employeeId

router.post('/attendance/checkin/:employeeId',catchAsync(checkInn));

// POST /attendance/checkout/:attendanceId
router.post('/attendance/checkout/:attendanceId',catchAsync(checkOut));

// GET /attendance/:employeeId
router.get('/attendance/:employeeId',catchAsync(getAttendanceById) );

// GET /attendance/all/:companyId
router.get('/attendance/all/:companyId', catchAsync(getAllAttendanceByCompany));

// GET /attendance/weekly/:employeeId
router.get('/attendance/weekly/:employeeId',catchAsync(getEmployeeAttendanceWeekly));



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