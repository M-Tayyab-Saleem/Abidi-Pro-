const Passenger = require("../../models/UserManagment/PassengerSchema");
const { NotFoundError, BadRequestError } = require("../../utils/ExpressError");

const createPassenger = async (req, res, next) => {
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

  await newPassenger.save();

  res.status(201).json({ passenger: newPassenger });
};

const getAllPassengers = async (req, res, next) => {
  const passengers = await Passenger.find({}).sort({ createdAt: -1 });

  if (!passengers.length) {
    return next(new NotFoundError("Passengers"));
  }

  res.status(200).json(passengers);
};

const getPassengerById = async (req, res, next) => {
  const { id } = req.params;
  const passenger = await Passenger.findById(id);

  if (!passenger) {
    return next(new NotFoundError("Passenger"));
  }

  res.status(200).json(passenger);
};

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
