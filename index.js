require('dotenv').config();

const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
require("./conn/conn");
const app = express();
const { ExpressError } = require("./utils/ExpressError");

// Import the cron job from utils
require("./utils/cronScheduler");  // This will execute the cron job when server starts
const PORT = process.env.PORT || 1000;


const allRoutes = require("./routes/allRoutes");
const globalErrorHandler = require('./middlewares/globalErrorHandler');

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// API routes
app.get('/', (req, res) => {
  res.send("Hello");
});

app.use("/api/viaRide", allRoutes);


app.all("*", (req, res, next) => {
  err = new ExpressError(404, "Page not Found");
  next(err);
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
