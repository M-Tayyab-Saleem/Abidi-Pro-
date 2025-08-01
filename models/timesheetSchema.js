const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    submittedHours: {
      type: Number,
      required: true,
      default: 0,
    },
    approvedHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    timeLogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TimeLog",
      },
    ],
    attachments: [
      {
        public_id: String,
        url: String,
        originalname: String,
        format: String,
        size: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

timesheetSchema.index({ employee: 1, date: 1 }, { unique: true });

const Timesheet = mongoose.models.Timesheet || mongoose.model("Timesheet", timesheetSchema);
module.exports = Timesheet;