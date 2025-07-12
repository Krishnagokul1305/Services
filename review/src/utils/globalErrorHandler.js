const { ApiResponse } = require("./ApiResponse");

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Validation Error: ${errors.join(", ")}`;
    return res.status(400).json(ApiResponse.validationError(message, errors));
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    return res.status(400).json(ApiResponse.badRequest(message));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json(ApiResponse.conflict(message));
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again!";
    return res.status(401).json(ApiResponse.unauthorized(message));
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired! Please log in again.";
    return res.status(401).json(ApiResponse.unauthorized(message));
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json(ApiResponse.error(message, statusCode));
};

module.exports = globalErrorHandler;
