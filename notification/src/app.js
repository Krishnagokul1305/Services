const express = require("express");
const cors = require("cors");
require("dotenv").config({
  path: "./config.env",
});

const emailRoutes = require("./route/emailRoutes");
const morgan = require("morgan");
const globalErrorHandler = require("./utils/globalErrorHandler");
const { ApiResponse } = require("./utils/ApiResponse");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json(ApiResponse.success({ status: "OK", service: "Notification Service" }));
});

// Routes
app.use("/api/v1/email", emailRoutes);

// 404 handler
app.all("*", (req, res) => {
  res
    .status(404)
    .json(ApiResponse.notFound(`Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8004;

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
  console.log(`Email service endpoint: http://localhost:${PORT}/api/v1/email/sendemail`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Email service check: http://localhost:${PORT}/api/v1/email/check`);
});

module.exports = app;
