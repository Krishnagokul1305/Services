class ApiResponse {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = "Success") {
    return new ApiResponse(true, message, data, 200);
  }

  static created(data, message = "Created successfully") {
    return new ApiResponse(true, message, data, 201);
  }

  static updated(data, message = "Updated successfully") {
    return new ApiResponse(true, message, data, 200);
  }

  static deleted(message = "Deleted successfully") {
    return new ApiResponse(true, message, null, 200);
  }

  static error(message = "An error occurred", statusCode = 500) {
    return new ApiResponse(false, message, null, statusCode);
  }

  static badRequest(message = "Bad request") {
    return new ApiResponse(false, message, null, 400);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiResponse(false, message, null, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiResponse(false, message, null, 403);
  }

  static notFound(message = "Not found") {
    return new ApiResponse(false, message, null, 404);
  }

  static conflict(message = "Conflict") {
    return new ApiResponse(false, message, null, 409);
  }

  static validationError(message = "Validation error", errors = null) {
    return new ApiResponse(false, message, errors, 422);
  }
}

module.exports = { ApiResponse };
