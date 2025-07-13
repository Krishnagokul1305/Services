const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
  path: "./config.env",
});

const cartRoutes = require("./routes/cartRoutes");
const globalErrorHandler = require("./utils/globalErrorHandler");
const connectDB = require("./utils/database");
const { ApiResponse } = require("./utils/ApiResponse");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8000", // Gateway
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json(
    ApiResponse.success(
      {
        status: "OK",
        service: "Cart Service",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      },
      "Cart service is running"
    )
  );
});

// API routes
app.use("/api/cart", cartRoutes);

// 404 handler
app.all("*", (req, res) => {
  res
    .status(404)
    .json(ApiResponse.notFound(`Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  connectDB()
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
