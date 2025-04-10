const router = require("express").Router();
const Trips = require('../../models/Trips/TripsSchema');
const validateRequest = require('../../middlewares/validateRequest');
const tripValidationSchema = require('../../JoiSchema/TripsJoiSchema');


////////////////////////////////////////////////////---CREATE-TRIPS---//////////////////////////////////////////////////////////////////////////
 

// CREATE Trips API
router.post("/trips-posting-values", validateRequest(tripValidationSchema), async (req, res) => {
    const { 
      tripPassanger,
      scheduledDate,
      tripFare,
      tripPaymentType,
      tripStatus,
      tripCurrentDate,
      tripDriver,
      tripVehicleType
    } = req.body;
  
    try {
        // Generate custom tripID (format: TRP001)
        const prefix = "TRP";
        const count = await Trips.countDocuments(); // Count total drivers
        const nextNumber = count + 1;
        const paddedNumber = String(nextNumber).padStart(3, "0"); // Ensures "001", "002", etc.
        const tripID = prefix + paddedNumber;
  
        // Check if a trip with the same tripID already exists
        const tripsExists = await Trips.findOne({ tripID });
        if (tripsExists) {
            return res.status(400).json({ message: 'Trips with this trip ID number already exists' });
        }
  
        // Create a new Trips document
        const newTrips = new Trips({
          tripID,
          tripPassanger,
          scheduledDate,
          tripFare,
          tripPaymentType,
          tripStatus,
          tripCurrentDate,
          tripDriver,
          tripVehicleType  
        });
  
        // Save the new trip to the database
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
        res.status(500).json({ error: 'Error creating Trips', details: error.message });
    }
  });


//////////////////////////////////////////////////////////---GET-ALL-TRIPS---///////////////////////////////////////////////////////////////////
 
 
// GET ALL TRIPS API
router.get("/trips-getting-values", async (req, res) => {
    try {
        const trips = await Trips.find({}).sort({ createdAt: -1 });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tripss', details: error.message });
    }
}
);
 

////////////////////////////////////////////////////---GET-SPECIFIC-TRIPS-BY-ID---/////////////////////////////////////////////////////////////////////////
 
 
// GET SPECIFIC TRIPS API
router.get("/trips-getting-values/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const trips = await Trips.findById(id);
 
        if (!trips) {
            return res.status(404).json({ error: 'TRIPS not found' });
        }
 
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving trips', details: error.message });
    }
}
);


module.exports = router;