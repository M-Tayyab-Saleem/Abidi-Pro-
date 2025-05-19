const express = require("express");
const router = express.Router();
const timeTrackerController = require("../../controllers/timeTrackerController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(catchAsync(timeTrackerController.createTimeLog))
  .get(catchAsync(timeTrackerController.getAllTimeLogs));

router
  .route("/:id")
  .get(catchAsync(timeTrackerController.getTimeLogById))
  .put(catchAsync(timeTrackerController.updateTimeLog))
  .delete(catchAsync(timeTrackerController.deleteTimeLog));

module.exports = router;
