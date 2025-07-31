const Project = require("../models/projectSchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");
const Task = require("../models/taskSchema");

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
  const project = await Project.findById(req.params.id)
    .populate('projectOwner')
    .populate('users')
    .populate('department');
  if (!project) throw new NotFoundError("Project");
  res.status(200).json(project);
});

// Get Project Tasks
exports.getProjectTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find({ project: req.params.id })
    .populate('assignedTo')
    .populate('assignedBy');
  res.status(200).json(tasks);
});

// Update Project by ID
exports.updateProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!project) throw new NotFoundError("Project");
  res.status(200).json(project);
});

// Delete Project
exports.deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new NotFoundError("Project");
  
  // Also delete all tasks associated with this project
  await Task.deleteMany({ project: req.params.id });
  
  res.status(200).json({ message: "Project deleted successfully" });
});

// Get Project Dashboard Data
exports.getProjectDashboard = catchAsync(async (req, res) => {
  const activeProjects = await Project.countDocuments({ status: 'Active' });
  const completedProjects = await Project.countDocuments({ status: 'Completed' });
  const openTasks = await Task.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
  const projectGroups = await Project.distinct('department').countDocuments();
  
  // Get data for charts
  const projectsByDepartment = await Project.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
    { $unwind: '$department' },
    { $project: { _id: 0, department: '$department.name', count: 1 } }
  ]);
  
  const statusData = await Project.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  res.status(200).json({
    activeProjects,
    completedProjects,
    openTasks,
    projectGroups,
    barChart: {
      labels: projectsByDepartment.map(d => d.department),
      datasets: [{
        data: projectsByDepartment.map(d => d.count),
        backgroundColor: "#BFDBFE",
        borderRadius: 4,
        barThickness: 30,
      }]
    },
    donutChart: {
      labels: ["Completed", "Remaining"],
      datasets: [{
        data: [completedProjects, activeProjects],
        backgroundColor: ["#93C5FD", "#E5E7EB"],
        hoverOffset: 4,
      }]
    }
  });
});
