const Trips = require("../../models/Trips/TripsSchema");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");

// POST: Create a new Trip
const post = async (req, res) => {
  const {
    tripPassanger,
    scheduledDate,
    tripFare,
    tripPaymentType,
    tripStatus,
    tripCurrentDate,
    tripDriver,
    tripVehicleType,
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

  const newTrips = new Trips({
    tripID,
    tripPassanger,
    scheduledDate,
    tripFare,
    tripPaymentType,
    tripStatus,
    tripCurrentDate,
    tripDriver,
    tripVehicleType,
  });

  await newTrips.save();

  res.status(201).json({
    trips: {
      tripID: newTrips.tripID,
      tripPassanger: newTrips.tripPassanger,
      scheduledDate: newTrips.scheduledDate,
      tripFare: newTrips.tripFare,
      tripPaymentType: newTrips.tripPaymentType,
      tripStatus: newTrips.tripStatus,
      tripCurrentDate: newTrips.tripCurrentDate,
      tripDriver: newTrips.tripDriver,
      tripVehicleType: newTrips.tripVehicleType,
    },
  });
};

// GET: Get all trips
const get = async (req, res) => {
  const trips = await Trips.find({}).sort({ createdAt: -1 });
  res.status(200).json(trips);
};

// GET: Get specific trip by ID
const getById = async (req, res) => {
  const { id } = req.params;

  const trips = await Trips.findById(id);
  if (!trips) {
    throw new NotFoundError("Trip");
  }

  res.status(200).json(trips);
};

module.exports = {
  post,
  get,
  getById,
};
