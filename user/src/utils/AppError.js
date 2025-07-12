class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new AppError(message, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }

  static notFound(message = "Not Found") {
    return new AppError(message, 404);
  }

  static internal(message = "Internal Server Error") {
    return new AppError(message, 500, false);
  }
}

module.exports = AppError;
