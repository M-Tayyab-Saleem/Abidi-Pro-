const mongoose = require("mongoose");

const Trips = new mongoose.Schema({
  tripID: {
    type: String,
  },
  tripPickupLoctaion: {
    lat: {
      type: String,
      required: true,
    },
    long: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    placeId: {
      type: String,
    },
  },

  tripDropoffLocation: {
    lat: {
      type: String,
      required: true,
    },
    long: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    placeId: {
      type: String,
    },

  },
  tripScheduledDate: {
    type: String,
    required: true,
  },
  tripfare: {
    type: String,
    required: true,
  },
  tripDistance: {
    type: String,
  },
  tripBookingCatagory: {
    type: String,
  },
  tripPaymentType: {
    type: String,
  },
  tripVehicleType: {
    type: String,
  },
  tripPassengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RidePassenger",
    default: null,
  },
  tripDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RideDrivers",
    default: null,
  },
  tripVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null,
  },
});
module.exports = mongoose.model("RideTrip", Trips);