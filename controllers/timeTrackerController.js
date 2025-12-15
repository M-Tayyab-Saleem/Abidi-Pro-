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
  // const { userId } = req.body;
  const userId = req.user.id;
  const todayStart = getStartOfDayUTC();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  // First, check if there's an open session from any previous day and auto-close it
  const openSession = await TimeTracker.findOne({
    user: userId,
    checkInTime: { $exists: true, $ne: null },
    checkOutTime: { $exists: false },
    date: { $lt: todayStart } // Any date before today
  });

  if (openSession) {
    console.log('Found open session from previous day during check-in:', openSession._id, 'Date:', openSession.date);
    // Auto-checkout the previous day's session
    const sessionDateEnd = new Date(openSession.date);
    sessionDateEnd.setUTCHours(23, 59, 59, 999);
    
    openSession.checkOutTime = new Date(sessionDateEnd);
    openSession.autoCheckedOut = true;
    
    const totalMs = openSession.checkOutTime.getTime() - new Date(openSession.checkInTime).getTime();
    openSession.totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
    
    if (openSession.totalHours >= 8) {
      openSession.status = "Present";
    } else if (openSession.totalHours >= 4) {
      openSession.status = "Half Day";
    } else {
      openSession.status = "Absent";
    }

    await openSession.save();
  }

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
    return res.status(200).json({ 
      message: openSession 
        ? "Checked in successfully. Previous day's session was auto-closed." 
        : "Checked in successfully", 
      log: saved,
      autoClosed: !!openSession
    });
  }

  // Create new log
  const newLog = await TimeTracker.create({
    user: userId,
    date: todayStart,
    checkInTime: new Date()
  });

  res.status(200).json({ 
    message: openSession 
      ? "Checked in successfully. Previous day's session was auto-closed." 
      : "Checked in successfully", 
    log: newLog,
    autoClosed: !!openSession
  });
});


// 2. Check-out - Updated to handle timezone issues
exports.checkOut = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const todayStart = getStartOfDayUTC();
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  console.log('Checkout - Today start:', todayStart, 'Today end:', todayEnd);

  // First, check if there's an open session from any previous day
  const openSession = await TimeTracker.findOne({
    user: userId,
    checkInTime: { $exists: true, $ne: null },
    checkOutTime: { $exists: false },
    date: { $lt: todayStart } // Any date before today
  });

  if (openSession) {
    console.log('Found open session from previous day:', openSession._id, 'Date:', openSession.date);
    // Auto-checkout the previous day's session
    // Set checkout time to end of the session's date
    const sessionDateEnd = new Date(openSession.date);
    sessionDateEnd.setUTCHours(23, 59, 59, 999);
    
    openSession.checkOutTime = new Date(sessionDateEnd);
    openSession.autoCheckedOut = true;
    
    const totalMs = openSession.checkOutTime.getTime() - new Date(openSession.checkInTime).getTime();
    openSession.totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
    
    if (openSession.totalHours >= 8) {
      openSession.status = "Present";
    } else if (openSession.totalHours >= 4) {
      openSession.status = "Half Day";
    } else {
      openSession.status = "Absent";
    }

    await openSession.save();
  }

  // Now handle today's check-out
  const todaysLog = await TimeTracker.findOne({
    user: userId,
    date: { $gte: todayStart, $lt: todayEnd }
  });

  console.log('Today\'s log found:', todaysLog);

  if (!todaysLog) {
    throw new BadRequestError("No check-in record found for today.");
  }

  if (!todaysLog.checkInTime) {
    throw new BadRequestError("Cannot check out before checking in.");
  }

  if (todaysLog.checkOutTime) {
    throw new BadRequestError("Already checked out today.");
  }

  todaysLog.checkOutTime = new Date();
  
  const totalMs = todaysLog.checkOutTime - todaysLog.checkInTime;
  todaysLog.totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));

  if (todaysLog.totalHours >= 8) {
    todaysLog.status = "Present";
  } else if (todaysLog.totalHours >= 4) {
    todaysLog.status = "Half Day";
  } else {
    todaysLog.status = "Absent";
  }

  await todaysLog.save();
  
  const responseMessage = openSession 
    ? "Checked out successfully. Previous day's session was auto-closed." 
    : "Checked out successfully";
    
  res.status(200).json({ message: responseMessage, log: todaysLog, autoClosed: !!openSession });
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


exports.getMonthlyAttendance = catchAsync(async (req, res) => {
  const { month, year } = req.params;
  const userId = req.user.id;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const attendance = await TimeTracker.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });

  res.status(200).json(attendance);
});


exports.checkOpenSessions = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const todayStart = getStartOfDayUTC();

  // Find any sessions where user checked in but never checked out from previous days
  const openSessions = await TimeTracker.find({
    user: userId,
    checkInTime: { $exists: true, $ne: null },
    checkOutTime: { $exists: false },
    date: { $lt: todayStart } 
  });

  res.status(200).json({ hasOpenSessions: openSessions.length > 0, openSessions });
});

// Manual trigger for auto-checkout (admin/testing purposes)
exports.manualAutoCheckout = catchAsync(async (req, res) => {
  const todayStart = getStartOfDayUTC();
  
  // Find ALL sessions where users checked in but didn't check out from ANY previous day
  const openSessions = await TimeTracker.find({
    checkInTime: { $exists: true, $ne: null },
    checkOutTime: { $exists: false },
    date: { $lt: todayStart }
  }).populate('user');

  let successfullyClosed = 0;
  let errors = 0;
  const errorsList = [];

  for (const session of openSessions) {
    try {
      // Get the end of the day for the session's date
      const sessionDateEnd = new Date(session.date);
      sessionDateEnd.setUTCHours(23, 59, 59, 999);
      
      // Set checkout time to end of the session's date
      session.checkOutTime = new Date(sessionDateEnd);
      session.autoCheckedOut = true;
      
      // Calculate total hours worked (cap at 24 hours for safety)
      const totalMs = session.checkOutTime.getTime() - new Date(session.checkInTime).getTime();
      const totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
      
      session.totalHours = Math.min(totalHours, 24);
      
      // Determine status
      if (session.totalHours >= 8) {
        session.status = "Present";
      } else if (session.totalHours >= 4) {
        session.status = "Half Day";
      } else {
        session.status = "Absent";
      }

      session.notes = session.notes 
        ? `${session.notes} | Auto-checked out manually` 
        : 'Auto-checked out manually';

      await session.save();
      successfullyClosed++;
    } catch (error) {
      errors++;
      errorsList.push({ sessionId: session._id, error: error.message });
    }
  }

  res.status(200).json({
    message: `Auto-checkout completed: ${successfullyClosed} successful, ${errors} errors`,
    successfullyClosed,
    errors,
    totalFound: openSessions.length,
    errorsList: errorsList.length > 0 ? errorsList : undefined
  });
});