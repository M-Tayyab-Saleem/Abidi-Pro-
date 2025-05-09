const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure the email is unique in the database
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
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to the Employee model
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", // Reference to the Company model
    required: true,
  },
  otp: {
    type: String, // OTP field for one-time password
  },
  otpExpires: {
    type: Date, // Timestamp for OTP expiry
  },
  passwordResetToken: {
    type: String, // Token used for password reset
  },
  passwordResetExpires: {
    type: Date, // Timestamp for password reset token expiry
  },
  refreshToken: {
    type: String, // Refresh token for session management
    select: false, // Don't include it in queries by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` automatically
});

// Method to generate access token
userSchema.methods.generateAccessToken = function() {
  const jwt = require("jsonwebtoken");
  const payload = {
    userId: this._id,
    role: this.role,
    companyId: this.company,  // Include company ID in the payload (optional)
  };
  
  // Set the token expiry (e.g., 15 minutes)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

userSchema.methods.generateAccessToken = function() {
  // Generate access token using JWT
  const jwt = require("jsonwebtoken");
  const payload = {
    userId: this._id,
    role: this.role,
  };
  
  // Set the token expiry (e.g., 15 minutes)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

module.exports = mongoose.model("User", userSchema);