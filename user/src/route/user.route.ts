import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  findByUsernameOrEmailController,
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsersController);
userRoute.get("/:id", getUserByIdController);
userRoute.patch("/:id", upload.single("avatar"), updateUserController);
userRoute.delete("/:id", deleteUserController);
userRoute.get("/search", findByUsernameOrEmailController);
userRoute.post("/", createUserController);

export default userRoute;
