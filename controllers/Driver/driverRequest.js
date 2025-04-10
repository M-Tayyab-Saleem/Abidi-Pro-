const Driver = require("../../models/UserManagment/DriverSchema");

const createOrUpdateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverDeclineReason, driverReSubmit } = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { driverDeclineReason, driverReSubmit },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    return res.json(updatedDriver);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllDriverRequests = async (req, res) => {
  try {
    const drivers = await Driver.find({}).sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving drivers", details: error.message });
  }
};

const getDriverRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving driver", details: error.message });
  }
};

module.exports = {
  createOrUpdateDriver,
  getAllDriverRequests,
  getDriverRequestById,
};
