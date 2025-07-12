const express = require("express");
const {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  findByUsernameOrEmailController,
  changePasswordController,
} = require("../controller/user.controller.js");
const { upload } = require("../middleware/multer.js");
const { isAuthenticated } = require("../middleware/auth.js");

const userRoute = express.Router();

// Public routes
userRoute.get("/search", findByUsernameOrEmailController);
userRoute.get("/", getAllUsersController);
userRoute.post("/", createUserController);

// Protected routes (require authentication) - specific routes before parameterized ones
userRoute.patch("/change-password", isAuthenticated, changePasswordController);
userRoute.get("/:id", getUserByIdController);
userRoute.patch(
  "/:id",
  isAuthenticated,
  upload.single("avatar"),
  updateUserController
);
userRoute.delete("/:id", isAuthenticated, deleteUserController);

module.exports = userRoute;
