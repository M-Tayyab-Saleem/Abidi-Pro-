const Holiday = require("../models/holidaySchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create Holiday
exports.createHoliday = catchAsync(async (req, res) => {
  const { date, day, holidayName, holidayType, description, isRecurring } = req.body;

  const existingHoliday = await Holiday.findOne({ date });
  if (existingHoliday) {
    throw new BadRequestError("Holiday for this date already exists");
  }

  const newHoliday = new Holiday({
    date,
    day,
    holidayName,
    holidayType,
    description,
    isRecurring: isRecurring || false,
  });

  const savedHoliday = await newHoliday.save();
  res.status(201).json(savedHoliday);
});

// Get All Holidays
exports.getAllHolidays = catchAsync(async (req, res) => {
  const holidays = await Holiday.find().sort({ date: 1 });
  res.status(200).json(holidays);
});

// Get Holiday by ID
exports.getHolidayById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const holiday = await Holiday.findById(id);

  if (!holiday) throw new NotFoundError("Holiday");

  res.status(200).json(holiday);
});

// Update Holiday
exports.updateHoliday = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const holiday = await Holiday.findById(id);
  if (!holiday) throw new NotFoundError("Holiday");

  // Only update allowed fields
  const allowedFields = ["date", "day", "holidayName", "holidayType", "description", "isRecurring"];
  
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      holiday[field] = updates[field];
    }
  });

  const updatedHoliday = await holiday.save();
  res.status(200).json(updatedHoliday);
});

// Delete Holiday
exports.deleteHoliday = catchAsync(async (req, res) => {
  const { id } = req.params;
  const holiday = await Holiday.findByIdAndDelete(id);

  if (!holiday) throw new NotFoundError("Holiday");

  res.status(200).json({ message: "Holiday deleted successfully" });
});

// Get Holidays by Year
exports.getHolidaysByYear = catchAsync(async (req, res) => {
  const { year } = req.params;
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const holidays = await Holiday.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });

  res.status(200).json(holidays);
});