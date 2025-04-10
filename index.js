const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
require("./conn/conn");
const app = express();

// Import the cron job from utils
require("./utils/cronScheduler");  // This will execute the cron job when server starts

// // Import routes
// const auth = require("./routes/UserManagment/auth");
// const userPassenger = require('./routes/UserManagment/userPassenger');
// const dispatcher = require('./routes/UserManagment/dispatacher');
// const accountant = require('./routes/UserManagment/accountant');
// const vehicle = require('./routes/VehicleManagment/Vehicle');
// const allDriver = require('./routes/Driver/allDrivers');
// const driverRequest = require('./routes/Driver/driverRequest');
// const trips = require('./routes/Trips/trips');
// const userDriver = require('./routes/UserManagment/userDriver');
// const logsRouter = require('./routes/Logs/LogController');

const allRoutes = require("./routes/allRoutes");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// API routes
app.get('/', (req, res) => {
  res.send("Hello");
});
app.use("/api/viaRide", allRoutes);


const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
