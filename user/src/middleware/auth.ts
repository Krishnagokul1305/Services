import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(ApiResponse.error("unathorized"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(ApiResponse.error("Invalid token"));
  }
};

export const isAuthorized =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user?.role)) {
      return res
        .status(403)
        .json(
          ApiResponse.error("You are not authorized to perform this action")
        );
    }
    next();
  };
