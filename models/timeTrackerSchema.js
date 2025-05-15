const mongoose = require("mongoose");

const timeTrackerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: String
  },
  checkoutTime: {
    type: String
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
  }
}, { timestamps: true });

module.exports = mongoose.model("TimeTracker", timeTrackerSchema);
