const router = require("express").Router();
const Driver = require('../../models/UserManagment/DriverSchema'); // rename import


// GET ALL DRIVER API
router.get("/allDriver", async (req, res) => {
    try {
        const driver = await Driver.find({}).sort({ createdAt: -1 });
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving drivers', details: error.message });
    }
}
);

 
////////////////////////////////////////////////////---GET-SPECIFIC-DRIVER-BY-ID---/////////////////////////////////////////////////////////////////////////
 
 
// GET SPECIFIC DRIVER API
router.get("/allDriver/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const driver = await Driver.findById(id);
 
        if (!driver) {
            return res.status(404).json({ error: 'User not found' });
        }
 
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving driver', details: error.message });
    }
}
);


module.exports =router;