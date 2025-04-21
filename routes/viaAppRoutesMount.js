const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./viaApp/authRoutes");
const userRoutes = require("./viaApp/userRoutes");
const passengerRoutes = require("./viaApp/passengerRoutes");
const driverRoutes = require("./viaApp/driverRoutes");
const vehicleRoutes = require("./viaApp/vehicleRoutes");
const tripRoutes = require("./viaApp/tripRoutes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/passengers", passengerRoutes);
router.use("/drivers", driverRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/trips", tripRoutes);

module.exports = router;