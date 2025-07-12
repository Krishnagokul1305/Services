class ApiResponse {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data) {
    return new ApiResponse(true, data, null);
  }

  static error(error) {
    return new ApiResponse(false, null, error);
  }
}

module.exports = { ApiResponse };
