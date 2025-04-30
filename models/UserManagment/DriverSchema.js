const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    driverID: {
      type: String,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverContact: {
      type: String,
      unique: true,
      required: true,
    },
    driverEarning: {
      type: String,
    },
    driverJoiningDate: {
      type: String,
    },
    driverAge: {
      type: String,
    },

    driverGender: {
      type: String,
    },
    driverRating: {
      type: String,
    },
    driverCnic: {
      type: String,
      unique: true,
    },
    driverLicenseNumber: {
      type: String,
      unique: true,
    },
    driverAccountNumber: {
      type: String,
    },
    driverTotalTrips: {
      type: String,
    },
    driverEmail: {
      type: String,
      unique: true,
    },
    driverBankName: {
      type: String,
    },
    driverBirthDate: {
      type: String,
    },
    lastseen: {
      type: String,
    },
    driverDeclineReason: {
      type: String,
    },
    driverApprovedDocuments: {
      type: [String],
    },
    driverDeclinedDocuments: {
      type: [String],
    },
    driverProfilePic: {
      url: String,
      filename: String,
    },
    driverHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RideTrip",
        default: null,
      },
    ],
    driverCnicPicFront: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    driverCnicPicBack: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    driverLicensePicFront: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    driverLicensePicBack: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    status: {
      type: String,
      enum: ["approved", "inactive", "active" , "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RideDrivers", DriverSchema);

// driverStatus: {
//     type: Number
// },
// driverProfilePic: {
//     type: String
// },
// driverCurrentLocation: {
//     type: String,
//     required: true,
//     unique: true
// },
// driverLicensePicture: {
//     type: PNG,
//     required: true,
//     unique: true
// },
// driverCnicPicture: {
//     type: String,
//     required: true,
//     unique: true
// },
