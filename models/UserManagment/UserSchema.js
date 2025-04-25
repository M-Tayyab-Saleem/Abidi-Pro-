const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
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
    contact: {
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
