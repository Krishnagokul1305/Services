class ApiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  static success(data, message = "Success") {
    return new ApiResponse(200, message, data, true);
  }

  static created(data, message = "Created successfully") {
    return new ApiResponse(201, message, data, true);
  }

  static badRequest(message = "Bad request") {
    return new ApiResponse(400, message, null, false);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiResponse(401, message, null, false);
  }

  static forbidden(message = "Forbidden") {
    return new ApiResponse(403, message, null, false);
  }

  static notFound(message = "Not found") {
    return new ApiResponse(404, message, null, false);
  }

  static internalError(message = "Internal server error") {
    return new ApiResponse(500, message, null, false);
  }
}

module.exports = { ApiResponse };
