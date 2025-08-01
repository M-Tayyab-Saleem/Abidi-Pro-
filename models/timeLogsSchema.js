const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    attachments: [
      {
        public_id: String,
        url: String,
        originalname: String,
        format: String,
        size: Number,
      },
    ],
    isAddedToTimesheet: {
      type: Boolean,
      default: false,
    },
    timesheet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timesheet",
    },
  },
  {
    timestamps: true,
  }
);

const TimeLog = mongoose.models.TimeLog || mongoose.model("TimeLog", timeLogSchema);
module.exports = TimeLog;