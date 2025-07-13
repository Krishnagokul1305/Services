const express = require("express");
const cors = require("cors");
require("dotenv").config({
  path: "./config.env",
});

const reviewRoutes = require("./route/review.route");
const morgan = require("morgan");
const globalErrorHandler = require("./utils/globalErrorHandler");
const { ApiResponse } = require("./utils/ApiResponse");
const connectDB = require("./utils/database");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json(ApiResponse.success({ status: "OK", service: "Review Service" }));
});

// Routes
app.use("/", reviewRoutes);

// 404 handler
app.all("/{*any}", (req, res) => {
  res
    .status(404)
    .json(ApiResponse.notFound(`Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  connectDB()
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log(`Review service running on port ${PORT}`);
});

module.exports = app;
