const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));

// Authentication middleware for cart routes
const authenticateCartRoutes = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required for cart operations",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Verify token (use the same secret as your services)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key_here"
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    });
  }
};

app.use(
  "/users",
  createProxyMiddleware({
    target: "http://localhost:8001",
    changeOrigin: true,
    pathRewrite: {
      "^/users": "/api/users",
    },
  })
);

app.use(
  "/products",
  createProxyMiddleware({
    target: "http://localhost:8001",
    changeOrigin: true,
    pathRewrite: {
      "^/products": "/api/products",
    },
  })
);

app.use(
  "/reviews",
  createProxyMiddleware({
    target: "http://localhost:8002",
    changeOrigin: true,
    pathRewrite: {
      "^/reviews": "/api/reviews",
    },
  })
);

// Cart service with authentication at gateway level
app.use(
  "/cart",
  authenticateCartRoutes, // Apply authentication middleware
  createProxyMiddleware({
    target: "http://localhost:3004",
    changeOrigin: true,
    pathRewrite: {
      "^/cart": "/api/cart",
    },
    onProxyReq: (proxyReq, req, res) => {
      // Forward user info to cart service
      if (req.user) {
        proxyReq.setHeader("X-User-Id", req.user.id);
        proxyReq.setHeader("X-User-Email", req.user.email);
      }
    },
  })
);

app.listen(8000, () => {
  console.log("API Gateway running on port 8000");
  console.log("Available routes:");
  console.log("- /users -> User Service (localhost:8001)");
  console.log("- /products -> Product Service (localhost:8001)");
  console.log("- /reviews -> Review Service (localhost:8002)");
  console.log("- /cart -> Cart Service (localhost:3004) [AUTH REQUIRED]");
});
