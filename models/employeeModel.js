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
  designation: {
    type: String,
    enum: ["Manager", "Engineer", "Director", "Intern", "HR", "Sales", "Developer"], // You can adjust this list as needed
    required: true,
  },
  department: {
    type: String,
    enum: ["HR", "Engineering", "Sales", "Finance", "Marketing", "Operations"], // Enum for departments
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // Reference to the Branch model
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  salary: {
    type: Number,
    required: true, // Assuming salary is a required field
  },
  address: {
    type: String, // Employee's address
  },
  contact: {
    type: String, // Employee's contact number
  },
  employmentStatus: {
    type: String,
    enum: ["Active", "On Leave", "Terminated"], // Enum for employment status
    default: "Active", // Default value set to Active
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
