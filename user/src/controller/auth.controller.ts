import { Request, Response } from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from "../service/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(ApiResponse.error("Email and password are required"));
  }

  try {
    const { user, token } = await login(email, password);
    res.status(200).json(ApiResponse.success([{ ...user, token }]));
  } catch (error: any) {
    res.status(401).json(ApiResponse.error(error.message));
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json(ApiResponse.error("Email is required"));

  try {
    await forgotPassword(email);
    res.status(200).json(ApiResponse.success([]));
  } catch (error: any) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json(ApiResponse.error("Token and new password are required"));
  }

  try {
    await resetPassword(token, newPassword);
    res.status(200).json(ApiResponse.success([]));
  } catch (error: any) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const meController = async (req: Request, res: Response) => {
  try {
    const user = await getMe((req as any).user.id);
    if (!user) return res.status(404).json(ApiResponse.error("User not found"));
    res.status(200).json(ApiResponse.success([user]));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
