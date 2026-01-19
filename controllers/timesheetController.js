const Timesheet = require("../models/timesheetSchema");
const TimeLog = require("../models/timeLogsSchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create Timesheet
exports.createTimesheet = catchAsync(async (req, res) => {
  let { name, description, timeLogs, date } = req.body;
  const employee = req.user.id;
  const attachments = req.files;
  const employeeName = req.user.name;
  
  // FIX: Handle FormData 'timeLogs' field.
  // If only 1 log is sent, it comes as a string. If multiple, it comes as an array.
  let logIds = [];
  if (Array.isArray(timeLogs)) {
    logIds = timeLogs;
  } else if (timeLogs) {
    logIds = [timeLogs];
  }

  if (logIds.length === 0) {
    throw new BadRequestError("No time logs provided");
  }

  // Determine Timesheet Date (Use selected date if sent, otherwise today)
  const timesheetDate = date ? new Date(date) : new Date();

  // Verify all time logs belong to the employee and aren't already in a timesheet
  const logs = await TimeLog.find({
    _id: { $in: logIds },
    employee,
    isAddedToTimesheet: false,
  });

  if (logs.length !== logIds.length) {
    throw new BadRequestError("Invalid time logs or logs already added to another timesheet");
  }

  // Calculate total hours
  const submittedHours = logs.reduce((total, log) => total + log.hours, 0);

  const attachmentData = attachments?.map(file => ({
    public_id: file.public_id,
    url: file.path,
    originalname: file.originalname,
    format: file.format,
    size: file.size
  }));

  // Create timesheet
  const timesheet = new Timesheet({
    name,
    description,
    employee,
    employeeName,
    date: timesheetDate, 
    submittedHours,
    timeLogs: logIds,
    attachments: attachmentData || [],
  });

  // Save timesheet and update time logs
  const savedTimesheet = await timesheet.save();

  // Update time logs to mark them as added to timesheet
  await TimeLog.updateMany(
    { _id: { $in: logIds } },
    { isAddedToTimesheet: true, timesheet: savedTimesheet._id }
  );

  res.status(201).json(savedTimesheet);
});

// Get Timesheets for Employee
exports.getEmployeeTimesheets = catchAsync(async (req, res) => {
  const employee = req.user.id;
  const { month, year } = req.query;
  
  let query = { employee };
  
  if (month && year) {
    // Construct date range for the month in UTC
    // Using simple string construction to avoid timezone shifts
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
    query.date = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const timesheets = await Timesheet.find(query)
    .populate("timeLogs")
    .sort({ date: -1 }); // Sort by newest first

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
  const { month, year } = req.query;
  
  let query = {};
  
  if (month && year) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));
    
    query.date = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const timesheets = await Timesheet.find(query)
    .populate("timeLogs")
    .sort({ date: -1 });
    
  res.status(200).json(timesheets);
});