const express = require("express");
const router = express.Router();
const leaveController = require("../../controllers/leaveRequest");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(catchAsync(leaveController.createLeaveRequest))
  .get(catchAsync(leaveController.getLeaveRequests));

router
  .route("/:id")
  .get(catchAsync(leaveController.getLeaveRequestById))
  .put(catchAsync(leaveController.updateLeaveRequest))
  .delete(catchAsync(leaveController.deleteLeaveRequest));

module.exports = router;
