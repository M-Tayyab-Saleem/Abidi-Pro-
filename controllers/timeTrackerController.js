const TimeTracker = require("../models/timeTrackerSchema");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError, BadRequestError } = require("../utils/ExpressError");

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



// Helper function to get start of day in UTC
const getStartOfDayUTC = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// 1. Check-in
exports.checkIn = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const todayStart = getStartOfDayUTC();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  // Find existing log for today
  const existingLog = await TimeTracker.findOne({
    user: userId,
    date: { $gte: todayStart, $lt: todayEnd }
  });

  if (existingLog) {
    if (existingLog.checkInTime) {
      throw new BadRequestError("Already checked in today.");
    }
    existingLog.checkInTime = new Date();
    const saved = await existingLog.save();
    return res.status(200).json({ message: "Checked in successfully", log: saved });
  }

  // Create new log
  const newLog = await TimeTracker.create({
    user: userId,
    date: todayStart,
    checkInTime: new Date()
  });

  res.status(200).json({ message: "Checked in successfully", log: newLog });
});

// 2. Check-out
exports.checkOut = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const todayStart = getStartOfDayUTC();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  // Find today's log
  const log = await TimeTracker.findOne({
    user: userId,
    date: { $gte: todayStart, $lt: todayEnd }
  });

  if (!log) {
    throw new BadRequestError("No check-in record found for today.");
  }

  if (!log.checkInTime) {
    throw new BadRequestError("Cannot check out before checking in.");
  }

  if (log.checkOutTime) {
    throw new BadRequestError("Already checked out today.");
  }

  log.checkOutTime = new Date();
  
  // Calculate total hours worked
  const totalMs = log.checkOutTime - log.checkInTime;
  log.totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));

  await log.save();
  res.status(200).json({ message: "Checked out successfully", log });
});

// 3. Get Today's Log for User
exports.getDailyLog = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const todayStart = getStartOfDayUTC();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  const log = await TimeTracker.findOne({
    user: userId,
    date: { $gte: todayStart, $lt: todayEnd }
  });

  if (!log) {
    return res.status(200).json({ message: "No log found for today." });
  }

  res.status(200).json(log);
});
