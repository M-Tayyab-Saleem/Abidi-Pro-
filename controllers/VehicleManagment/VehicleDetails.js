const Vehicle = require("../../models/UserManagment/DriverSchema");

const getAllVehiclesDetails = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving vehicles",
      details: error.message,
    });
  }
};

const getVehicleDetailsById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving vehicle",
      details: error.message,
    });
  }
};

const postDeclineOrResubmitVehicle = async (req, res) => {
  const { id } = req.params;
  const { vehicleDeclineReason, vehicleReSubmit } = req.body;

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { vehicleDeclineReason, vehicleReSubmit },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(updatedVehicle);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = {
  getAllVehiclesDetails,
  getVehicleDetailsById,
  postDeclineOrResubmitVehicle,
};
