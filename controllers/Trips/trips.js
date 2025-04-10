const Trips = require("../../models/Trips/TripsSchema");

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

  try {
    const prefix = "TRP";
    const count = await Trips.countDocuments();
    const nextNumber = count + 1;
    const paddedNumber = String(nextNumber).padStart(3, "0");
    const tripID = prefix + paddedNumber;

    const tripsExists = await Trips.findOne({ tripID });
    if (tripsExists) {
      return res
        .status(400)
        .json({ message: "Trip with this trip ID already exists" });
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
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error creating Trips", details: error.message });
  }
};

// GET: Get all trips
const get = async (req, res) => {
  try {
    const trips = await Trips.find({}).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving trips", details: error.message });
  }
};

// GET: Get specific trip by ID
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const trips = await Trips.findById(id);

    if (!trips) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json(trips);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving trip", details: error.message });
  }
};

module.exports = {
  post,
  get,
  getById,
};
