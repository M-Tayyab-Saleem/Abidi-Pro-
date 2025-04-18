require('dotenv').config();

const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
require("./conn/conn");
const app = express();
const { ExpressError } = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const refreshTokenMiddleware = require('./middlewares/refreshTokenMiddleware');

// Import the cron job from utils
require("./utils/cronScheduler");  // This will execute the cron job when server starts
const PORT = process.env.PORT || 1000;


const allRoutes = require("./routes/allRoutes");
const userRoutes = require("./routes/userRoutes");
const globalErrorHandler = require('./middlewares/globalErrorHandler');

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API routes
app.get('/', (req, res) => {
  res.send("Hello");
});

app.use("/api/viaRide", allRoutes);
app.use("/api/viaRide/app", userRoutes);
app.use(refreshTokenMiddleware);


app.all("*", (req, res, next) => {
  err = new ExpressError(404, "Page not Found");
  next(err);
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
