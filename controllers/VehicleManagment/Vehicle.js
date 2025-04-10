const Vehicle = require("../../models/UserManagment/DriverSchema");

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving vehicles", details: error.message });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving vehicle", details: error.message });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { make, carType, color, year, owner, licensePlateNo, feul } = req.body;

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { make, carType, color, year, owner, licensePlateNo, feul },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating vehicle", details: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting vehicle", details: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
