// gateway.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));

// Authentication middleware for protected routes
const authenticateCartRoutes = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Proxy: User Service
app.use(
  "/api/v1/users",
  createProxyMiddleware({
    target: "http://localhost:8003",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/users": "/api/v1/users" },
  })
);

// Proxy: Auth Service
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: "http://localhost:8003",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "/api/v1/auth" },
  })
);

app.use(
  "/api/v1/products",
  createProxyMiddleware({
    target: "http://localhost:8001", // assumed product runs here
    changeOrigin: true,
    pathRewrite: { "^/api/v1/products": "/api/v1/products" },
  })
);

app.use(
  "/api/v1/categories",
  createProxyMiddleware({
    target: "http://localhost:8001", // assumed same as product
    changeOrigin: true,
    pathRewrite: { "^/api/v1/categories": "/api/v1/categories" },
  })
);

// Proxy: Review Service
app.use(
  "/api/v1/reviews",
  createProxyMiddleware({
    target: "http://localhost:8002",
    changeOrigin: true,
    pathRewrite: { "^/api/v1/reviews": "/api/v1/reviews" },
  })
);

// Proxy: Cart Service (Protected)
// app.use(
//   "/api/v1/cart",
//   authenticateCartRoutes,
//   createProxyMiddleware({
//     target: "http://localhost:8004",
//     changeOrigin: true,
//     pathRewrite: { "^/api/v1/cart": "/api/v1/cart" },
//     onProxyReq: (proxyReq, req) => {
//       proxyReq.setHeader("X-User-Id", req.user.id);
//       proxyReq.setHeader("X-User-Email", req.user.email);
//     },
//   })
// );

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Gateway OK",
    services: ["users", "auth", "products", "reviews", "cart"],
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log("users - 8003");
  console.log("reviews - 8002");
  console.log("products - 8001");
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
