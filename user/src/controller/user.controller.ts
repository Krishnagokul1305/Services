import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  findByUsernameOrEmail,
} from "../service/user.service.js";

import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToS3FromFile } from "../utils/s3.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUserController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  if (!username || !email || !password) {
    return res
      .status(400)
      .json(ApiResponse.error("Username, email, and password are required"));
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json(ApiResponse.error("Invalid email format"));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(ApiResponse.error("Password must be at least 6 characters"));
  }

  try {
    const user = await createUser(req.body);
    res.status(201).json(ApiResponse.success([user]));
  } catch (error: any) {
    res
      .status(400)
      .json(ApiResponse.error(error.message || "Failed to create user"));
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found"));
    }
    res.status(200).json(ApiResponse.success([user]));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(ApiResponse.success(users));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json(ApiResponse.error("Invalid email format"));
  }

  if (password && password.length < 6) {
    return res
      .status(400)
      .json(ApiResponse.error("Password must be at least 6 characters"));
  }

  try {
    console.log(req.file);
    if (req.file) {
      const avatar = await uploadToS3FromFile(req.file);
      req.body.avatar = avatar;
    }
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(ApiResponse.success([updatedUser]));
  } catch (error: any) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json(ApiResponse.success([]));
  } catch (error: any) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const findByUsernameOrEmailController = async (
  req: Request,
  res: Response
) => {
  const identifier = req.query.identifier as string;

  if (!identifier || identifier.trim() === "") {
    return res
      .status(400)
      .json(ApiResponse.error("Identifier query param is required"));
  }

  try {
    const users = await findByUsernameOrEmail(identifier);
    res.status(200).json(ApiResponse.success(users));
  } catch (error: any) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};
