const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
    },
    vehicleID: {
      type: String,
      unique: true,
    },
    model: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    licensePlateNo: {
      type: String,
      required: true,
      unique: true,
    },
    chassisNo: {
      type: String,
      required: true,
    },
    seat: {
      type: String,
    },
    vehicleDeclineReason: {
      type: String,
    },
    vehicleDeclinedDocuments: {
      type: [String],
    },
    vehicleApprovedDocuments: {
      type: [String],
    },
    vehicleFrontImage: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    vehicleBackImage: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    vehicleRightImage: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    vehicleLeftImage: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    vehicleRegistrationBookFront: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RideDrivers",
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance", "pending","approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
