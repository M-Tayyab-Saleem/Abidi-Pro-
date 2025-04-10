const Driver = require("../../models/UserManagment/DriverSchema");

// CREATE Driver
const createDriver = async (req, res) => {
  try {
    const {
      driverName,
      driverContact,
      driverEarning,
      driverJoiningDate,
      driverAge,
      driverGender,
      driverRating,
      driverCnic,
      driverCardNumber,
      driverTotalTrips,
      driverEmail,
      driverCity,
      driverBankName,
      driverIban,
      make,
      carType,
      color,
      year,
      owner,
      licensePlateNo,
      feul,
    } = req.body;

    const driverExists = await Driver.findOne({ driverContact });
    if (driverExists) {
      return res
        .status(400)
        .json({ message: "Driver with this contact number already exists" });
    }

    const prefix = "RideDr";
    const count = await Driver.countDocuments();
    const nextNumber = count + 1;
    const paddedNumber = String(nextNumber).padStart(3, "0");
    const driverID = prefix + paddedNumber;

    const newDriver = new Driver({
      driverID,
      driverName,
      driverContact,
      driverEarning,
      driverJoiningDate,
      driverAge,
      driverGender,
      driverRating,
      driverCnic,
      driverCardNumber,
      driverTotalTrips,
      driverEmail,
      driverCity,
      driverBankName,
      driverIban,
      make,
      carType,
      color,
      year,
      owner,
      licensePlateNo,
      feul,
    });

    await newDriver.save();

    res.status(201).json({ driver: newDriver });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error creating driver", details: error.message });
  }
};

// GET ALL Drivers
const getAllUserDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({}).sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving drivers", details: error.message });
  }
};

// GET Driver by ID
const getUserDriverById = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ error: "User not found" });
    res.status(200).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving driver", details: error.message });
  }
};

// UPDATE Driver
const updateDriverById = async (req, res) => {
  const { id } = req.params;
  const {
    driverID,
    driverName,
    driverContact,
    driverAge,
    driverCnic,
    driverCardNumber,
  } = req.body;
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      {
        driverID,
        driverName,
        driverContact,
        driverAge,
        driverCnic,
        driverCardNumber,
      },
      { new: true }
    );
    if (!updatedDriver)
      return res.status(404).json({ error: "Driver not found" });
    res.json(updatedDriver);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

// DELETE Driver
const deleteDriverById = async (req, res) => {
  const { id } = req.params;
  try {
    await Driver.findByIdAndDelete(id);
    res.json({ message: "Driver Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

// Create or Update (Decline/Resubmit)
const updateDeclineOrResubmit = async (req, res) => {
  const { id } = req.params;
  const { driverDeclineReason, driverReSubmit } = req.body;
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { driverDeclineReason, driverReSubmit },
      { new: true }
    );
    if (!updatedDriver)
      return res.status(404).json({ error: "Driver not found" });
    res.json(updatedDriver);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = {
  createDriver,
  getAllUserDrivers,
  getUserDriverById,
  updateDriverById,
  deleteDriverById,
  updateDeclineOrResubmit,
};
