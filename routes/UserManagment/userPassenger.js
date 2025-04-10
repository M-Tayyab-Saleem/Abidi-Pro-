const router = require("express").Router();
const Passenger = require('../../models/UserManagment/PassengerSchema'); 
const validateRequest = require("../../middlewares/validateRequest");
const PassengerValidationSchema = require("../../JoiSchema/PassengerJoiSchema");


router.post("/createPassenger", validateRequest(PassengerValidationSchema) ,async (req, res) => {
  const { 
    passengerName, 
    passengerContact, 
    passengerEmail, 
    passengerRide, 
    passengerGender, 
    passengerCardNumber  } = req.body;
  try {
      const passengerExists = await Passenger.findOne({ passengerContact });
      if (passengerExists) {
          return res.status(400).json({ message: 'Passenger with this contact number already exists' });
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
      res.status(201).json({
          passenger: {
              passengerName: newPassenger.passengerName,
              passengerEmail: newPassenger.passengerEmail,
              passengerContact: newPassenger.passengerContact,
              passengerRide: newPassenger.passengerRide,
              passengerGender: newPassenger.passengerGender,
              passengerCardNumber: newPassenger.passengerCardNumber,
          },
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating passenger', details: error.message });
  }});

router.get("/createPassenger", async (req, res) => {
    try {
        const passenger = await Passenger.find({}).sort({ createdAt: -1 });
        res.status(200).json(passenger);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users', details: error.message });
    }});

router.get("/createPassenger/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const passenger = await Passenger.findById(id);
        if (!passenger) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(passenger);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving passenger', details: error.message });
    }});

router.put("/createPassenger/:id",async (req, res) => {
  try {
    const { id } = req.params;
    const {
      passengerName,
      passengerContact,
      passengerEmail,
      passengerRide,
      passengerGender,
      passengerCardNumber
    } = req.body;
    const updatedPassenger = await Passenger.findByIdAndUpdate(
      id,
      {
        passengerName,
        passengerContact,
        passengerEmail,
        passengerRide,
        passengerGender,
        passengerCardNumber
      },
      { new: true }
    );
    if (!updatedPassenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    return res.json(updatedPassenger);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }})

router.delete("/createPassenger/:id",async(req, res) => {
  try {
    const { id } = req.params;
    const deletedPassenger = await Passenger.findByIdAndDelete(id);
    return res.json({ message: " Passenger Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }});


module.exports =router;