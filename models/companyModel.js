const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  logo: {
    type: String, // To store the URL or file path of the logo image
  },
  website: {
    type: String, // Optional website URL for the company
  },
  phoneNumber: {
    type: String, // Optional company phone number
  },
  companyType: {
    type: String, // Optional company type (e.g., "Tech", "Manufacturing", etc.)
  },
  branches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // Reference to the Branch model
  }],
  departments: [{
    name: {
      type: String,
      required: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to the Employee who is the department head
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Admins associated with the company
  }],
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Employees of the company
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Company", companySchema);

