const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/projectController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(catchAsync(projectController.createProject))
  .get(catchAsync(projectController.getAllProjects));

router
  .route("/:id")
  .get(catchAsync(projectController.getProjectById))
  .put(catchAsync(projectController.updateProject))
  .delete(catchAsync(projectController.deleteProject));

module.exports = router;
