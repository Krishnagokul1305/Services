const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));

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
  "/reviews",
  createProxyMiddleware({
    target: "http://localhost:8002",
    changeOrigin: true,
    pathRewrite: {
      "^/reviews": "/api/reviews",
    },
  })
);

app.listen(8000, () => {
  console.log("API Gateway running on port 8000");
});
