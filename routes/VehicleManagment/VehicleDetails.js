const router = require("express").Router();
const Vehicle = require("../../models/UserManagment/DriverSchema");

router.get("/vehicle-details-get-values" , async (req , res) => {
      try {
            const vehicle = await Vehicle.find({}).sort({ createdAt: -1 });
            res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving Vehicles detail', details: error.message });
        }
})


// GET SPECIFIC DRIVER API
router.get("/vehicle-details-get-values/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findById(id);
 
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
 
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving Vehicles Details', details: error.message });
    }
}
);

////////katny ky bad ka kam

router.post("/vehicle-details-post-request/:id",async (req, res) => {
  try {
    const { id } = req.params;
 
    const {
        vehicleDeclineReason,
        vehicleReSubmit
    } = req.body;
 
    const createNewVehicle = await Driver.findByIdAndUpdate(
      id,
      {
        vehicleDeclineReason,
        vehicleReSubmit
      },
      { new: true }
    );
 
    if (!createNewVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
 
    return res.json(createNewVehicle);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
);


//////////////////////////////////////////////////////////---GET-ALL-DRIVER---///////////////////////////////////////////////////////////////////
  //ye whi kam hai jb katny ky bad yya pakry jany ky bad krty hain 
 
// GET ALL DRIVER API
router.get("/vehicle-details-get-request", async (req, res) => {
    try {
        const vehicle = await Vehicle.find({}).sort({ createdAt: -1 });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving vehicle', details: error.message });
    }
}
);
 

////////////////////////////////////////////////////---GET-SPECIFIC-DRIVER-BY-ID---/////////////////////////////////////////////////////////////////////////
 //ye whi kam hai jb katny ky bad yya pakry jany ky bad krty hain 
 
// GET SPECIFIC DRIVER API
router.get("/vehicle-details-get-request/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await Vehicle.findById(id);
 
        if (!vehicle) {
            return res.status(404).json({ error: 'vehicle not found' });
        }
 
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving vehicle', details: error.message });
    }
}
);


 
module.exports = router;
