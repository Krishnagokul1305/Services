const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const reviewRoutes = require("./route/review.route");
const globalErrorHandler = require("./utils/globalErrorHandler");
const { ApiResponse } = require("./utils/ApiResponse");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Health check route
app.get("/health", (req, res) => {
  res.json(ApiResponse.success({ status: "OK", service: "Review Service" }));
});

// Routes
app.use("/api/reviews", reviewRoutes);

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
  console.log(`Review service running on port ${PORT}`);
});

module.exports = app;
