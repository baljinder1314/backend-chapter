class ApiResponse {
  constructor(statusCode, data,  message = "success") {
    (statusCode, data, (success = statusCode < 400), message);
  }
}
