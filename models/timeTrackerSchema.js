// models/timeTrackerSchema.js
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
    default: () => new Date().setHours(0, 0, 0, 0)  // Reset time to 00:00:00
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
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submittedHours: {
    type: Number
  },
  absents: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("TimeTracker", timeTrackerSchema);
