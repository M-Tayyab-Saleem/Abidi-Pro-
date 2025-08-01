const Timesheet = require("../models/timesheetSchema");
const TimeLog = require("../models/timeLogsSchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create Timesheet
exports.createTimesheet = catchAsync(async (req, res) => {
  const { description, timeLogs, attachments } = req.body;
  const employee = req.user._id;
  const employeeName = req.user.name;
  const date = new Date(); // Current date

  // Check if timesheet already exists for this employee and date
  const existingTimesheet = await Timesheet.findOne({ employee, date });
  if (existingTimesheet) {
    throw new BadRequestError("Timesheet already exists for today");
  }

  // Verify all time logs belong to the employee and aren't already in a timesheet
  const logs = await TimeLog.find({
    _id: { $in: timeLogs },
    employee,
    isAddedToTimesheet: false,
  });

  if (logs.length !== timeLogs.length) {
    throw new BadRequestError("Invalid time logs or logs already added to another timesheet");
  }

  // Calculate total hours
  const submittedHours = logs.reduce((total, log) => total + log.hours, 0);

  // Create timesheet
  const timesheet = new Timesheet({
    name: `Timesheet ${date.toISOString().split('T')[0]}`,
    description,
    employee,
    employeeName,
    date,
    submittedHours,
    timeLogs,
    attachments,
  });

  // Save timesheet and update time logs
  const savedTimesheet = await timesheet.save();

  // Update time logs to mark them as added to timesheet
  await TimeLog.updateMany(
    { _id: { $in: timeLogs } },
    { isAddedToTimesheet: true, timesheet: savedTimesheet._id }
  );

  res.status(201).json(savedTimesheet);
});

// Get Timesheets for Employee
exports.getEmployeeTimesheets = catchAsync(async (req, res) => {
  const employee = req.user._id;
  const timesheets = await Timesheet.find({ employee }).populate("timeLogs");
  res.status(200).json(timesheets);
});

// Get Timesheet by ID
exports.getTimesheetById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const timesheet = await Timesheet.findById(id).populate("timeLogs");

  if (!timesheet) throw new NotFoundError("Timesheet");

  res.status(200).json(timesheet);
});

// Update Timesheet Status (for approval/rejection)
exports.updateTimesheetStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, approvedHours } = req.body;

  const timesheet = await Timesheet.findById(id);
  if (!timesheet) throw new NotFoundError("Timesheet");

  timesheet.status = status;
  if (approvedHours !== undefined) {
    timesheet.approvedHours = approvedHours;
  }

  const updatedTimesheet = await timesheet.save();
  res.status(200).json(updatedTimesheet);
});

// Get All Timesheets (for admin)
exports.getAllTimesheets = catchAsync(async (req, res) => {
  const timesheets = await Timesheet.find().populate("timeLogs");
  res.status(200).json(timesheets);
});