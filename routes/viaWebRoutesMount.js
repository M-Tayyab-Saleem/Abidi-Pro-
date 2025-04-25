const express = require("express");
const router = express.Router();


const authRoutes = require("./viaWeb/authWebRoutes");
const userRoutes = require("./viaWeb/userWebRoutes");
const driverRoutes = require("./viaWeb/driverWebRoutes");
const logRoutes = require("./viaWeb/logWebRoutes");
const tripRoutes = require("./viaWeb/tripsWebRoutes");
const accountantRoutes = require("./viaWeb/accountantWebRoutes");
const dispatcherRoutes = require("./viaWeb/dispatcherWebRoutes");
const passengerRoutes = require("./viaWeb/passengerWebRoutes");
const vehicleRoutes = require("./viaWeb/vehicleWebRoutes");
const zoneRoutes = require("./viaWeb/zoneWebRoutes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/drivers", driverRoutes);
router.use("/logs", logRoutes);
router.use("/trips", tripRoutes);
router.use("/accountants", accountantRoutes);
router.use("/dispatchers", dispatcherRoutes);
router.use("/passengers", passengerRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/zone", zoneRoutes);

module.exports = router;