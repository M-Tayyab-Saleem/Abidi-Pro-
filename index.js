require('dotenv').config();

const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
require("./conn/conn");
const app = express();
const { ExpressError } = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
// const refreshTokenMiddleware = require('./middlewares/refreshTokenMiddleware');


require("./utils/cronScheduler");  
const PORT = process.env.PORT || 3000;


const allRoutes = require("./routes/allRoutes");
const webRoutes = require("./routes/webRoutesMount");
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3002', 'exp://192.168.18.10:8081'],
  credentials: true, 
};


app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API routes
app.get('/', (req, res) => {
  res.send("Hello");
});

app.use('/api',allRoutes)
app.use("/api/web", webRoutes);

// app.use(refreshTokenMiddleware);
app.all("*", (req, res, next) => {
  err = new ExpressError(404, "Page not Found");
  next(err);
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
