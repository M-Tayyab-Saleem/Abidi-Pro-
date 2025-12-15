const mongoose = require("mongoose");

const timeTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0)
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  totalHours: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day', 'Leave', 'Holiday'],
    default: 'Present'
  },
  notes: {
    type: String
  },
  autoCheckedOut: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("TimeTracker", timeTrackerSchema);
