const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema(
  {
    zoneName: {
      type: String,
      required: true,
      unique: true,
    },
    tripRequestVolume: {
      type: Number,
      required: true,
      min: 0,
    },
    extraFarePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zone", zoneSchema);