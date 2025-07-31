const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    timeZone: {
      type: String,
      // enum: Intl.supportedValuesOf("timeZone"),
      required: true,
    },
    reportsTo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    empID: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    empType: {
      type: String,
      enum: ["Permanent", "Contractor", "Intern", "Part Time"],
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    address: {
      type: String,
    },
    empStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    salary: {
      type: Number,
    },
    about: {
      type: String,
    },
    experience: [
      {
        company: String,
        jobType: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    DOB: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    emergencyContact: [
      {
        name: String,
        relation: String,
        phone: Number,
      },
    ],
    addedby: {
      type: String,
    },
    otp: {
      type: Number,
    },
    otpExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    avalaibleLeaves: {
      type: Number,
      default: 15, 
    },
    bookedLeaves: {
      type: Number,
      default: 0,
    },
    leaveHistory: [{
      leaveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveRequest"
      },
      leaveType: String,
      startDate: Date,
      endDate: Date,
      status: String,
      daysTaken: Number
    }],
  },

  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function () {
  const jwt = require("jsonwebtoken");
  const payload = {
    userId: this._id,
    role: this.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
