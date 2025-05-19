const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = async () => {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Connected Successfully!!");

    mongoose.connection.on('error', err => {
      console.error('Mongoose connection error:', err);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

conn();
