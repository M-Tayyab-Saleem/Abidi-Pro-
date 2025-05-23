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



// 1. Check-in
exports.checkIn = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);

  let existingLog = await TimeTracker.findOne({ user: userId, date: today });

  if (existingLog && existingLog.checkInTime) {
    throw new BadRequestError("Already checked in today.");
  }

  if (!existingLog) {
    existingLog = new TimeTracker({
      user: userId,
      date: today,
      checkInTime: new Date()
    });
  } else {
    existingLog.checkInTime = new Date();
  }

  const saved = await existingLog.save();
  res.status(200).json({ message: "Checked in successfully", log: saved });
});

// 2. Check-out
exports.checkOut = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);

  const log = await TimeTracker.findOne({ user: userId, date: today });

  if (!log || !log.checkInTime) {
    throw new BadRequestError("Cannot check out before checking in.");
  }

  if (log.checkOutTime) {
    throw new BadRequestError("Already checked out today.");
  }

  log.checkOutTime = new Date();

  // Calculate total hours
  const totalMs = new Date(log.checkOutTime) - new Date(log.checkInTime);
  log.totalHours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;

  await log.save();
  res.status(200).json({ message: "Checked out successfully", log });
});

// 3. Get Today’s Log for User
exports.getDailyLog = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const today = new Date().setHours(0, 0, 0, 0);

  const log = await TimeTracker.findOne({ user: userId, date: today });

  if (!log) {
    return res.status(200).json({ message: "No log found for today." });
  }

  res.status(200).json(log);
});
