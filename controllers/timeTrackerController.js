const TimeTracker = require("../models/timeTrackerSchema");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError } = require("../utils/ExpressError");

// Create Time Log
exports.createTimeLog = catchAsync(async (req, res) => {
  const newLog = new TimeTracker(req.body);
  const savedLog = await newLog.save();
  res.status(201).json(savedLog);
});

// Get All Time Logs
exports.getAllTimeLogs = catchAsync(async (req, res) => {
  const logs = await TimeTracker.find().populate('user');
  res.status(200).json(logs);
});

// Get Time Log by ID
exports.getTimeLogById = catchAsync(async (req, res) => {
  const log = await TimeTracker.findById(req.params.id).populate('user');
  if (!log) throw new NotFoundError("Time log");
  res.status(200).json(log);
});

// Update Time Log
exports.updateTimeLog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const log = await TimeTracker.findById(id);
  if (!log) throw new NotFoundError("Time log");

  Object.assign(log, updates);
  const updated = await log.save();

  res.status(200).json(updated);
});

// Delete Time Log
exports.deleteTimeLog = catchAsync(async (req, res) => {
  const log = await TimeTracker.findByIdAndDelete(req.params.id);
  if (!log) throw new NotFoundError("Time log");

  res.status(200).json({ message: "Time log deleted successfully" });
});
