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
  },
  { timestamps: true }
);

module.exports = mongoose.model("RideUser", userSchema);
