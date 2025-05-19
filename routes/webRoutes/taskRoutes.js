const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(catchAsync(taskController.createTask))
  .get(catchAsync(taskController.getAllTasks));

router
  .route("/:id")
  .get(catchAsync(taskController.getTaskById))
  .put(catchAsync(taskController.updateTask))
  .delete(catchAsync(taskController.deleteTask));

module.exports = router;
