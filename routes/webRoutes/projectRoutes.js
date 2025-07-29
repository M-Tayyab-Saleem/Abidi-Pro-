// projectRoutes.js
const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/projectController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(projectController.createProject)
  .get(projectController.getAllProjects);

router.get('/dashboard', projectController.getProjectDashboard);

router
  .route("/:id")
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;