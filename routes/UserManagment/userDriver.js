const router = require("express").Router();
const Driver = require("../../models/UserManagment/DriverSchema"); // rename import
const validateRequest = require("../../middlewares/validateRequest");
const {
  driverValidationSchema,
  driverUpdateSchema,
} = require("../../JoiSchema/DriverJoiSchema");

// CREATE DRIVER API
router.post(
  "/driver-posting-entry",
  validateRequest(driverValidationSchema),
  async (req, res) => {
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

      // Check if driver with the same contact already exists
      const driverExists = await Driver.findOne({ driverContact });
      if (driverExists) {
        return res
          .status(400)
          .json({ message: "Driver with this contact number already exists" });
      }

      // Generate custom driverID (format: RideDr001)
      const prefix = "RideDr";
      const count = await Driver.countDocuments(); // Count total drivers
      const nextNumber = count + 1;
      const paddedNumber = String(nextNumber).padStart(3, "0"); // Ensures "001", "002", etc.
      const driverID = prefix + paddedNumber;

      // Create new driver instance
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

      // Save to database
      await newDriver.save();

      res.status(201).json({
        driver: {
          driverID: newDriver.driverID,
          driverName: newDriver.driverName,
          driverContact: newDriver.driverContact,
          driverEarning: newDriver.driverEarning,
          driverJoiningDate: newDriver.driverJoiningDate,
          driverAge: newDriver.driverAge,
          driverGender: newDriver.driverGender,
          driverRating: newDriver.driverRating,
          driverCnic: newDriver.driverCnic,
          driverCardNumber: newDriver.driverCardNumber,
          driverTotalTrips: newDriver.driverTotalTrips,
          driverEmail: newDriver.driverEmail,
          driverCity: newDriver.driverCity,
          driverBankName: newDriver.driverBankName,
          driverIban: newDriver.driverIban,
          make: newDriver.make,
          carType: newDriver.carType,
          color: newDriver.color,
          year: newDriver.year,
          owner: newDriver.owner,
          licensePlateNo: newDriver.licensePlateNo,
          feul: newDriver.feul,
        },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error creating driver", details: error.message });
    }
  }
);

//////////////////////////////////////////////////////////---GET-ALL-DRIVER---///////////////////////////////////////////////////////////////////

// GET ALL DRIVER API
router.get("/driver-getting-values", async (req, res) => {
  try {
    const driver = await Driver.find({}).sort({ createdAt: -1 });
    res.status(200).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving drivers", details: error.message });
  }
});

////////////////////////////////////////////////////---GET-SPECIFIC-DRIVER-BY-ID---/////////////////////////////////////////////////////////////////////////

// GET SPECIFIC DRIVER API
router.get("/driver-getting-values/:id", async (req, res) => {
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
});

////////////////////////////////////////////////////---UPDATE-BY-ID---////////////////////////////////////////////////////////////////////////

// UPDATED DRIVER BY ID
router.put("/driver-putting-values/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      driverID,
      driverName,
      driverContact,
      driverAge,
      driverCnic,
      driverCardNumber,
    } = req.body;

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

    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    return res.json(updatedDriver);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

////////////////////////////////////////////////////////---DELETE-BY-ID---/////////////////////////////////////////////////////////////////////

// DELETE DRIVER BY ID
router.delete("/driver-deleting-values/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Driver.findByIdAndDelete(id);

    return res.json({ message: " Driver Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

//ye whi kam hai jb katny ky bad yya pakry jany ky bad krty hain
// CREATE OR UPDATE DRIVER BY ID
router.post("/driver-posting-form/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { driverDeclineReason, driverReSubmit } = req.body;

    const createNewDriver = await Driver.findByIdAndUpdate(
      id,
      {
        driverDeclineReason,
        driverReSubmit,
      },
      { new: true }
    );

    if (!createNewDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    return res.json(createNewDriver);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

//////////////////////////////////////////////////////////---GET-ALL-DRIVER---///////////////////////////////////////////////////////////////////
//ye whi kam hai jb katny ky bad yya pakry jany ky bad krty hain

// GET ALL DRIVER API
router.get("/driver-requestion-form", async (req, res) => {
  try {
    const driver = await Driver.find({}).sort({ createdAt: -1 });
    res.status(200).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving drivers", details: error.message });
  }
});

////////////////////////////////////////////////////---GET-SPECIFIC-DRIVER-BY-ID---/////////////////////////////////////////////////////////////////////////
//ye whi kam hai jb katny ky bad yya pakry jany ky bad krty hain

// GET SPECIFIC DRIVER API
router.get("/driver-requestion-form/:id", async (req, res) => {
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
});

module.exports = router;
