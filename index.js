require('dotenv').config();

const express = require("express");
const cors = require("cors");
require("./conn/conn");
const cookieParser = require("cookie-parser");
const refreshTokenMiddleware = require('./middlewares/refreshTokenMiddleware');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', "http://localhost:5174","http://localhost:5175"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,                
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Refresh Token Middleware globally
app.use(refreshTokenMiddleware);

// Routes
app.use('/api', require('./routes/allRoutes'));
app.use('/api/web', require('./routes/webRoutesMount'));

app.all("*", (req, res, next) => {
  const { ExpressError } = require("./utils/ExpressError");
  next(new ExpressError(404, "Page not Found"));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
