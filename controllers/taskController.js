const Task = require("../models/taskSchema");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError } = require("../utils/ExpressError");

// Create Task
exports.createTask = catchAsync(async (req, res) => {
  const task = new Task(req.body);
  const savedTask = await task.save();
  res.status(201).json(savedTask);
});

// Get All Tasks
exports.getAllTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find()
    .populate('assignedTo')
    .populate('assignedBy');
  res.status(200).json(tasks);
});

// Get Task by ID
exports.getTaskById = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo')
    .populate('assignedBy');

  if (!task) throw new NotFoundError("Task");
  res.status(200).json(task);
});

// Update Task
exports.updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const task = await Task.findById(id);
  if (!task) throw new NotFoundError("Task");

  Object.assign(task, updates);
  const updatedTask = await task.save();

  res.status(200).json(updatedTask);
});

// Delete Task
exports.deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new NotFoundError("Task");
  res.status(200).json({ message: "Task deleted successfully" });
});
