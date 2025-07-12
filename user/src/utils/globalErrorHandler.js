const AppError = require("./AppError.js");
const { ApiResponse } = require("./ApiResponse.js");

function globalErrorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    console.log(err);
    res.status(err.statusCode).json(ApiResponse.error(err.message));
  } else {
    console.error("Unhandled Error:", err);
    res.status(500).json(ApiResponse.error("Something went wrong"));
  }
}

module.exports = { globalErrorHandler };
