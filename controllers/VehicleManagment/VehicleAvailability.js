const Vehicle = require("../../models/UserManagment/DriverSchema");

const getVehicleAvailability = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving Vehicles detail",
      details: error.message,
    });
  }
};

module.exports = {
  getVehicleAvailability,
};
