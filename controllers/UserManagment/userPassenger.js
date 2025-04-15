const Passenger = require("../../models/UserManagment/PassengerSchema");
const { NotFoundError, BadRequestError } = require("../../utils/ExpressError");


// create a new passenger
const createPassenger = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;
  console.log(url, "... ", filename);
  const {
    passengerName,
    passengerContact,
    passengerEmail,
    passengerRide,
    passengerGender,
    passengerCardNumber,
  } = req.body;

  const passengerExists = await Passenger.findOne({ passengerContact });
  if (passengerExists) {
    return next(new BadRequestError("Passenger with this contact number already exists"));
  }

  const newPassenger = new Passenger({
    passengerName,
    passengerContact,
    passengerEmail,
    passengerRide,
    passengerGender,
    passengerCardNumber,
  });

  newPassenger.passengerImage = {
    url,
    filename,
  };

  await newPassenger.save();

  res.status(201).json({ passenger: newPassenger });
};


// Get all passengers
const getAllPassengers = async (req, res, next) => {
  const passengers = await Passenger.find({}).sort({ createdAt: -1 });

  if (!passengers.length) {
    return next(new NotFoundError("Passengers"));
  }

  res.status(200).json(passengers);
};


// Get a passenger by ID
const getPassengerById = async (req, res, next) => {
  const { id } = req.params;
  const passenger = await Passenger.findById(id);

  if (!passenger) {
    return next(new NotFoundError("Passenger"));
  }

  res.status(200).json(passenger);
};


// Update passenger details
const updatePassenger = async (req, res, next) => {
  const { id } = req.params;
  const {
    passengerName,
    passengerContact,
    passengerEmail,
    passengerRide,
    passengerGender,
    passengerCardNumber,
  } = req.body;

  const updatedPassenger = await Passenger.findByIdAndUpdate(
    id,
    {
      passengerName,
      passengerContact,
      passengerEmail,
      passengerRide,
      passengerGender,
      passengerCardNumber,
    },
    { new: true }
  );

  if (!updatedPassenger) {
    return next(new NotFoundError("Passenger"));
  }

  res.status(200).json(updatedPassenger);
};


// Delete a passenger
const deletePassenger = async (req, res, next) => {
  const { id } = req.params;
  const deletedPassenger = await Passenger.findByIdAndDelete(id);

  if (!deletedPassenger) {
    return next(new NotFoundError("Passenger"));
  }

  res.status(200).json({ message: "Passenger deleted successfully" });
};

module.exports = {
  createPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
};
