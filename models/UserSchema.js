// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   employeeId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   contact: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   role: {
//     type: String,
//     enum: ["Employee", "HR", "Manager", "Admin"],
//     default: "Employee"
//   },
//   department: {
//     type: String,
//     enum: ["HR", "Finance", "Marketing", "Sales"],
//     default: "HR",
//     },
//   designation: {
//     type: String,
//     enum: ["Junior", "Senior", "Lead"],
//     default: "Junior",
//     },
//   dateOfJoining: {
//     type: Date,
//     default: Date.now
//     },
//   salary: {
//     type: Number,
//     default: 0
//     },
//   address: {
//     type: String,
//     default: ""
//     },
//   employmentStatus: {
//     type: String,
//     enum: ["Active", "On Leave", "Terminated"],
//     default: "Active"
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false
//   },
//   otp: String,
//   otpExpires: Date,
//   passwordResetToken: String,
//   passwordResetExpires: Date,
//   refreshToken: {
//     type: String,
//     select: false
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model("Employee", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "SubAdmin", "Employee"],
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
