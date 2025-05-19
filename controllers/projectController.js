const Project = require("../models/projectSchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create Project
exports.createProject = catchAsync(async (req, res) => {
  const project = new Project(req.body);
  const savedProject = await project.save();
  res.status(201).json(savedProject);
});

// Get All Projects
exports.getAllProjects = catchAsync(async (req, res) => {
  const projects = await Project.find()
    .populate('projectOwner')
    .populate('users')
    .populate('department');

  res.status(200).json(projects);
});

// Get Project by ID
exports.getProjectById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id)
    .populate('projectOwner')
    .populate('users')
    .populate('department');

  if (!project) throw new NotFoundError("Project");

  res.status(200).json(project);
});

// Update Project by ID
exports.updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const project = await Project.findById(id);
  if (!project) throw new NotFoundError("Project");

  Object.assign(project, updates);
  const updatedProject = await project.save();

  res.status(200).json(updatedProject);
});

// Delete Project
exports.deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new NotFoundError("Project");

  res.status(200).json({ message: "Project deleted successfully" });
});
