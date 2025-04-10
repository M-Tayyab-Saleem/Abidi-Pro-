const router = require("express").Router();
const Vehicle = require("../../models/UserManagment/DriverSchema");

router.get("/vehicle-availability-get-values" , async (req , res) => {
      try {
            const vehicle = await Vehicle.find({}).sort({ createdAt: -1 });
            res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving Vehicles detail', details: error.message });
        }
})



module.exports = router;