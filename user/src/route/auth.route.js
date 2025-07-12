const express = require("express");
const {
  loginController,
  forgotPasswordController,
  resetPasswordController,
  meController,
  refreshTokenController,
  logoutController,
} = require("../controller/auth.controller.js");
const { isAuthenticated } = require("../middleware/auth.js");

const authRoute = express.Router();

authRoute.post("/login", loginController);
authRoute.post("/refresh-token", refreshTokenController);
authRoute.post("/logout", isAuthenticated, logoutController);
authRoute.post("/forgot-password", forgotPasswordController);
authRoute.post("/reset-password", resetPasswordController);
authRoute.get("/me", isAuthenticated, meController);

module.exports = authRoute;
