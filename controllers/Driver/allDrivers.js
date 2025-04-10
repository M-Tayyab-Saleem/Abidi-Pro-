const Driver = require("../../models/UserManagment/DriverSchema");

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({}).sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving drivers",
      details: error.message,
    });
  }
};

const getDriverById = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving driver",
      details: error.message,
    });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
};
