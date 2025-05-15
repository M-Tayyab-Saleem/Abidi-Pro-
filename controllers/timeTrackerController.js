const TimeTracker = require("../models/timeTrackerSchema");

// CREATE
exports.createTimeLog = async (req, res) => {
  const {
    user,
    date,
    checkInTime,
    checkoutTime,
    totalHours,
    status,
    submittedHours
  } = req.body;

  try {
    const newLog = new TimeTracker({
      user,
      date,
      checkInTime,
      checkoutTime,
      totalHours,
      status,
      submittedHours
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create time log" });
  }
};

// READ ALL
exports.getAllTimeLogs = async (req, res) => {
  try {
    const logs = await TimeTracker.find().populate('user');
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch time logs" });
  }
};

// READ BY ID
exports.getTimeLogById = async (req, res) => {
  try {
    const log = await TimeTracker.findById(req.params.id).populate('user');
    if (!log) return res.status(404).json({ message: "Time log not found" });
    res.status(200).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch time log" });
  }
};

// UPDATE
exports.updateTimeLog = async (req, res) => {
  const { id } = req.params;
  const {
    user,
    date,
    checkInTime,
    checkoutTime,
    totalHours,
    status,
    submittedHours
  } = req.body;

  try {
    const log = await TimeTracker.findById(id);
    if (!log) return res.status(404).json({ message: "Time log not found" });

    log.user = user || log.user;
    log.date = date || log.date;
    log.checkInTime = checkInTime || log.checkInTime;
    log.checkoutTime = checkoutTime || log.checkoutTime;
    log.totalHours = totalHours || log.totalHours;
    log.status = status || log.status;
    log.submittedHours = submittedHours || log.submittedHours;

    const updated = await log.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update time log" });
  }
};

// DELETE
exports.deleteTimeLog = async (req, res) => {
  try {
    const log = await TimeTracker.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: "Time log not found" });
    res.status(200).json({ message: "Time log deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete time log" });
  }
};
