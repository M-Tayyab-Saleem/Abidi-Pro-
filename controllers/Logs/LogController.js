const Log = require("../../models/Logs/LogSchema");
const { info, warn, error, debug } = require("../../utils/logger");

const saveLog = async (level, message) => {
  try {
    const log = new Log({
      level,
      message,
      createdAt: new Date(),
    });

    await log.save();

    switch (level) {
      case "info":
        info(message);
        break;
      case "warn":
        warn(message);
        break;
      case "error":
        error(message);
        break;
      case "debug":
        debug(message);
        break;
      default:
        error(`Unknown log level: ${level}`);
        break;
    }
  } catch (err) {
    error(`Error while saving log: ${err.message}`);
  }
};

// Create a custom log
const createLog = async (req, res) => {
  const { level, message } = req.body;

  if (!level || !message) {
    return res.status(400).json({ message: "Level and message are required" });
  }

  try {
    await saveLog(level, message);
    res.status(200).json({ message: "Log entry created successfully." });
  } catch (err) {
    error(`Failed to create log: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create log", error: err.message });
  }
};

// Create info log
const createInfoLog = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    await saveLog("info", message);
    res.status(200).json({ message: "Info log created" });
  } catch (err) {
    error(`Error while creating info log: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create info log", error: err.message });
  }
};

// Create error log
const createErrorLog = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    await saveLog("error", message);
    res.status(200).json({ message: "Error log created" });
  } catch (err) {
    error(`Error while creating error log: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create error log", error: err.message });
  }
};

// Get all logs (with pagination)
const getAllLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await Log.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalLogs = await Log.countDocuments();

    if (!logs.length) {
      return res.status(404).json({ message: "No logs found" });
    }

    res.status(200).json({
      logs,
      totalLogs,
    });
  } catch (err) {
    error(`Error fetching logs: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch logs", error: err.message });
  }
};

// Create warn log
const createWarnLog = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    await saveLog("warn", message);
    res.status(200).json({ message: "warn log created" });
  } catch (err) {
    error(`error while creating warn log: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create warn log", error: err.message });
  }
};

// Create debug log
const createDebugLog = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    await saveLog("debug", message);
    res.status(200).json({ message: "debug log created" });
  } catch (err) {
    error(`error while creating debug log: ${err.message}`);
    res
      .status(500)
      .json({ message: "Failed to create debug log", error: err.message });
  }
};



module.exports = {
  createLog,
  createInfoLog,
  createErrorLog,
  getAllLogs,
  createWarnLog,
  createDebugLog,
};
