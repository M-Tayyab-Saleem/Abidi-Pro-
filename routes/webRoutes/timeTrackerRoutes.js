const express = require("express");
const router = express.Router();
const timeTrackerController = require("../../controllers/timeTrackerController");
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");

router.use(isLoggedIn);

router
  .route("/")
  .post(timeTrackerController.createTimeLog)
  .get(timeTrackerController.getAllTimeLogs);
  
// Check-in route
router.post('/check-in', timeTrackerController.checkIn);

// Check-out route
router.post('/check-out', timeTrackerController.checkOut);

// Get today's log for a user
router.get('/daily-log/:userId', timeTrackerController.getDailyLog);

router.get('/attendance/:month/:year', timeTrackerController.getMonthlyAttendance);

router.get('/open-sessions', timeTrackerController.checkOpenSessions);

// Manual trigger for auto-checkout (admin/testing purposes)
router.post('/manual-auto-checkout', timeTrackerController.manualAutoCheckout);


router
  .route("/:id")
  .get(timeTrackerController.getTimeLogById)
  .put(timeTrackerController.updateTimeLog)
  .delete(timeTrackerController.deleteTimeLog);



module.exports = router;
