const express = require("express");
const router = express.Router();
const fileController = require("../../controllers/fileManagementController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(catchAsync(fileController.createFile))
  .get(catchAsync(fileController.getAllFiles));

router
  .route("/:id")
  .get(catchAsync(fileController.getFileById))
  .put(catchAsync(fileController.updateFile))
  .delete(catchAsync(fileController.deleteFile));

module.exports = router;
