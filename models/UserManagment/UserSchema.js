const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      unique: false,
      sparse: true, // sparse avoids errors on null
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      Select : false,
    },
    role: {
      type: String,
    },
    contact:{
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
    customId: {
      type: String,
    },
    assignedTrip: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RideUser", userSchema);
