const { ExpressError, BadRequestError } = require("../utils/ExpressError");

const globalErrorHandler = (err, req, res, next) => {
  

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map(val => val.message)
        .join(", ");
      err = new BadRequestError(message);
    }
  
  
  
    if (err.name === "CastError") {
      err = new BadRequestError(`Invalid ${err.path}: ${err.value}`);
    }
  
    const statusCode = err.status || 500;
    const message = err.message || "Something went wrong";
    
    console.error("Error:", err);
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, 
    });
  };

  module.exports = globalErrorHandler;