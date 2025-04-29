const Trips = require("../../models/Trips/TripsSchema");
const Driver = require("../../models/UserManagment/DriverSchema");
const Passenger = require("../../models/UserManagment/PassengerSchema");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");

const post = async (req, res) => {
  const {
    tripPickupLoctaion,
    tripDropoffLocation,
    tripScheduledDate,
    tripfare,
    tripDistance,
    tripBookingCatagory,
    tripPaymentType,
    tripVehicleType,
    tripPassengerId,
    tripDriverId,
    tripVehicleId,
  } = req.body;

  const prefix = "TRP";
  const count = await Trips.countDocuments();
  const nextNumber = count + 1;
  const paddedNumber = String(nextNumber).padStart(3, "0");
  const tripID = prefix + paddedNumber;

  const tripsExists = await Trips.findOne({ tripID });
  if (tripsExists) {
    throw new BadRequestError("Trip with this trip ID already exists");
  }

  // Check if passenger and driver exist
  const passenger = await Passenger.findById(tripPassengerId);
  if (!passenger) {
    throw new NotFoundError("Passenger not found");
  }

  const driver = await Driver.findById(tripDriverId);
  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  const newTrip = new Trips({
    tripID,
    tripPickupLoctaion,
    tripDropoffLocation,
    tripScheduledDate,
    tripfare,
    tripDistance,
    tripBookingCatagory,
    tripPaymentType,
    tripVehicleType,
    tripPassengerId,
    tripDriverId,
    tripVehicleId,
  });

  const savedTrip = await newTrip.save();

  // Update passenger's total rides and add trip to history
  passenger.passengerTotalRides = (passenger.passengerTotalRides || 0) + 1;
  passenger.passengerHistory.push(savedTrip._id);
  await passenger.save();

  // Update driver's total trips
  driver.driverTotalTrips = (driver.driverTotalTrips || 0) + 1;
  driver.driverHistory.push(savedTrip._id);

  await driver.save();

  res.status(201).json({
    success: true,
    trip: savedTrip,
    message: "Trip created successfully",
  });
};

// GET: Get all trips
const get = async (req, res) => {
  const trips = await Trips.find({})
    .populate("tripPassengerId", "passengerName passengerContact passengerImage")
    .populate("tripDriverId", "driverName driverContact driverProfilePic driverRating assignedVehicle driverTotalTrips driverID")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    trips,
  });
};

// GET: Get specific trip by ID
const getById = async (req, res) => {
  const { id } = req.params;

  const trip = await Trips.findById(id)
    .populate(
      "tripPassengerId",
      "passengerName passengerContact passengerImage"
    )
    .populate({
      path: "tripDriverId",
      populate: {
        path: "assignedVehicle",
        model: "Vehicle"
      },
      select: "driverName driverContact driverProfilePic driverRating assignedVehicle driverTotalTrips driverID"
    })
    
  if (!trip) {
    throw new NotFoundError("Trip");
  }

  res.status(200).json({
    success: true,
    trip,
  });
};
// DELETE: Delete a trip by ID
const deleteById = async (req, res) => {
  const { id } = req.params;

  const trip = await Trips.findById(id);
  if (!trip) {
    throw new NotFoundError("Trip");
  }

  // Get passenger and driver references before deleting the trip
  const passengerId = trip.tripPassengerId;
  const driverId = trip.tripDriverId;

  // Delete the trip
  await Trips.findByIdAndDelete(id);

  // Update passenger's total rides and remove trip from history
  if (passengerId) {
    await Passenger.findByIdAndUpdate(passengerId, {
      $inc: { passengerTotalRides: -1 },
      $pull: { passengerHistory: id },
    });
  }

  // Update driver's total trips
  if (driverId) {
    await Driver.findByIdAndUpdate(driverId, {
      $inc: { driverTotalTrips: -1 },
    });
  }

  res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
};

module.exports = {
  post,
  get,
  getById,
  deleteById,
};
