const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  findByUsernameOrEmail,
  changePassword,
} = require("../service/user.service.js");

const { ApiResponse } = require("../utils/ApiResponse.js");
const { uploadToS3FromFile } = require("../utils/s3.js");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createUserController = async (req, res) => {
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
  } catch (error) {
    res
      .status(400)
      .json(ApiResponse.error(error.message || "Failed to create user"));
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found"));
    }
    res.status(200).json(ApiResponse.success([user]));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

const getAllUsersController = async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(ApiResponse.success(users));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

const updateUserController = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;
  const authenticatedUserId = req.user.id;

  if (userId !== authenticatedUserId) {
    return res
      .status(403)
      .json(ApiResponse.error("You can only update your own account"));
  }

  if (email && !emailRegex.test(email)) {
    return res.status(400).json(ApiResponse.error("Invalid email format"));
  }

  try {
    console.log(req.file);
    if (req.file) {
      const avatar = await uploadToS3FromFile(req.file);
      req.body.avatar = avatar;
    }
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(ApiResponse.success([updatedUser]));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

const deleteUserController = async (req, res) => {
  const userId = req.params.id;
  const authenticatedUserId = req.user.id;

  if (userId !== authenticatedUserId) {
    return res
      .status(403)
      .json(ApiResponse.error("You can only delete your own account"));
  }

  try {
    await deleteUser(req.params.id);
    res.status(200).json(ApiResponse.success([]));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

const findByUsernameOrEmailController = async (req, res) => {
  const identifier = req.query.identifier;

  if (!identifier || identifier.trim() === "") {
    return res
      .status(400)
      .json(ApiResponse.error("Identifier query param is required"));
  }

  try {
    const users = await findByUsernameOrEmail(identifier);
    res.status(200).json(ApiResponse.success(users));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

const changePasswordController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Get user ID from authenticated user

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json(
        ApiResponse.error("Current password and new password are required")
      );
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json(ApiResponse.error("New password must be at least 6 characters"));
  }

  try {
    const result = await changePassword(userId, currentPassword, newPassword);
    res.status(200).json(ApiResponse.success([result]));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

module.exports = {
  createUserController,
  getUserByIdController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  findByUsernameOrEmailController,
  changePasswordController,
};
