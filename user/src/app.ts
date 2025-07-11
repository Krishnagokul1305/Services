import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";
import userRoute from "./route/user.route.js";
import authRoute from "./route/auth.route.js";
import { AppError } from "./utils/AppError.js";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";

const PORT = process.env.PORT || 8000;

const app = express();

dotenv.config({
  path: "./.env",
});

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/users", userRoute);

app.use("/api/v1/auth", authRoute);

app.use("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
