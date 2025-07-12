const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

dotenv.config({ path: "./config.env" });

const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./route/user.route.js");
const authRoute = require("./route/auth.route.js");
const AppError = require("./utils/AppError.js");
const { globalErrorHandler } = require("./utils/globalErrorHandler.js");

const PORT = process.env.PORT || 8000;

const app = express();

// console.log(process.cwd());

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1/users", userRoute);

app.use("/api/v1/auth", authRoute);

app.use("/{*any}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
