const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
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
    required: true,
  },
  reportsTo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
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
  phoneNumber: {
    type: Number,
    required: true,
    unique: true, 
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
  experience: {
    type: String,
  },
  education: {
    type: String,
  },
  DOB: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  addedby: {
    type: String,
  },
  addedTime: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
