const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const morgan = require("morgan");
const cors = require("cors");
const categoryRoute = require("./route/category.route.js");
const productRoute = require("./route/product.route.js");
const AppError = require("./utils/AppError.js");
const { globalErrorHandler } = require("./utils/globalErrorHandler.js");
const connectDB = require("./utils/database.js");

const PORT = process.env.PORT || 8001;

// Connect to MongoDB
connectDB();

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product service is running",
    timestamp: new Date().toISOString(),
    service: "product-service",
    version: "1.0.0",
  });
});

// Handle undefined routes
// app.use("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Product service is running on port ${PORT}`);
});

module.exports = app;
