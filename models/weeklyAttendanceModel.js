const mongoose = require("mongoose");

const weeklyAttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  weekEndDate: {
    type: Date,
    required: true,
  },
  weeklyData: [{
    day: {
      type: String,  // e.g. "Monday"
    },
    status: {
      type: String,  // "Present", "Absent", or "Leave"
    },
    checkInTime: Date,
    checkOutTime: Date,
  }],
});

module.exports = mongoose.model("WeeklyAttendance", weeklyAttendanceSchema);
