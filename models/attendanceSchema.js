// const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema({
//   employee: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Employee",
//     required: true
//   },  
//   date: {
//     type: String,
//     required: true
//   },
//   checkIn: String,
//   checkOut: String,
//   status: {
//     type: String,
//     enum: ["Present", "Absent", "Leave"],
//     required: true
//   },
//   notes: String
// });

// module.exports = mongoose.model("Attendance", attendanceSchema);
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
    required: true,
  },
  notes: {
    type: String,
  },
});
// / Add a method to calculate work hours
attendanceSchema.methods.calculateWorkHours = function () {
  const checkIn = this.checkIn;
  const checkOut = this.checkOut;
  if (!checkIn || !checkOut) return 0;

  const workDuration = (checkOut - checkIn) / (1000 * 60 * 60); // Convert from milliseconds to hours
  return workDuration;
};

// Pre-save hook to check if attendance should be marked
attendanceSchema.pre("save", function (next) {
  const workDuration = this.calculateWorkHours();

  // Check if the work duration is at least 8 hours
  if (workDuration < 8) {
    this.status = "Absent";  // If work hours are less than 8, mark attendance as "Absent"
    this.notes = "Worked less than 8 hours. Attendance not marked.";
  } else {
    this.status = "Present";  // Otherwise, mark as "Present"
  }

  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);