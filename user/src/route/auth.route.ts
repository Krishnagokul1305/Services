import express from "express";
import {
  loginController,
  forgotPasswordController,
  resetPasswordController,
  meController,
} from "../controller/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const authRoute = express.Router();

authRoute.post("/login", loginController);
authRoute.post("/forgot-password", forgotPasswordController);
authRoute.post("/reset-password", resetPasswordController);
authRoute.get("/me", isAuthenticated, meController);

export default authRoute;
