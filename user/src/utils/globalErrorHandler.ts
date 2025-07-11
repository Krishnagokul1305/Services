import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError.js";
import { ApiResponse } from "./ApiResponse.js";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ApiResponse.error(err.message));
  } else {
    console.error("Unhandled Error:", err);
    res.status(500).json(ApiResponse.error("Something went wrong"));
  }
}
