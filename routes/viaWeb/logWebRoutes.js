const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const logValidationSchema = require("../../JoiSchema/LogJoiSchema");


const {
  createLog,
  createInfoLog,
  createErrorLog,
  createDebugLog,
  createWarnLog,
  getAllLogs,
} = require("../../controllers/Logs/LogController");


router.route("/")
  .get(isLoggedIn, restrictTo('admin'), catchAsync(getAllLogs))
  .post(isLoggedIn, restrictTo('admin'), validateRequest(logValidationSchema), catchAsync(createLog));

router.route("/info")
  .post(isLoggedIn, restrictTo('admin'), validateRequest(logValidationSchema), catchAsync(createInfoLog));

router.route("/error")
  .post(isLoggedIn, restrictTo('admin'), validateRequest(logValidationSchema), catchAsync(createErrorLog));

router.route("/warn")
  .post(isLoggedIn, restrictTo('admin'), validateRequest(logValidationSchema), catchAsync(createWarnLog));

router.route("/debug")
  .post(isLoggedIn, restrictTo('admin'), validateRequest(logValidationSchema), catchAsync(createDebugLog));

module.exports = router;