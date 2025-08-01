const express = require("express");
const router = express.Router();
const timeTrackerController = require("../../controllers/timeTrackerController");
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");

router.use(isLoggedIn);

router
  .route("/")
  .post(catchAsync(timeTrackerController.createTimeLog))
  .get(catchAsync(timeTrackerController.getAllTimeLogs));
  
// Check-in route
router.post('/check-in', timeTrackerController.checkIn);

// Check-out route
router.post('/check-out', timeTrackerController.checkOut);

// Get today's log for a user
router.get('/daily-log/:userId', timeTrackerController.getDailyLog);

router
  .route("/:id")
  .get(catchAsync(timeTrackerController.getTimeLogById))
  .put(catchAsync(timeTrackerController.updateTimeLog))
  .delete(catchAsync(timeTrackerController.deleteTimeLog));

module.exports = router;
