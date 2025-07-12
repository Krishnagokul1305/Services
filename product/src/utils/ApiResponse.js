class ApiResponse {
  constructor(data = null, message = "Success", success = true) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(data = null, message = "Success") {
    return new ApiResponse(data, message, true);
  }

  static error(message = "An error occurred", data = null) {
    return new ApiResponse(data, message, false);
  }

  static created(data = null, message = "Resource created successfully") {
    return new ApiResponse(data, message, true);
  }

  static updated(data = null, message = "Resource updated successfully") {
    return new ApiResponse(data, message, true);
  }

  static deleted(message = "Resource deleted successfully") {
    return new ApiResponse(null, message, true);
  }

  static notFound(message = "Resource not found") {
    return new ApiResponse(null, message, false);
  }

  static validation(errors, message = "Validation failed") {
    return new ApiResponse(errors, message, false);
  }
}

module.exports = { ApiResponse };
