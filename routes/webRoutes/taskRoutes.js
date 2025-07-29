const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
