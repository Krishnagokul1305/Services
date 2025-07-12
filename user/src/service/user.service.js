const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");

const createUser = async (data) => {
  // Set default avatar if not provided
  const userData = {
    ...data,
    avatar:
      data.avatar ||
      "https://s3-cdn-practise-bucket.s3.ap-south-1.amazonaws.com/uploads/default-profile.jpg",
  };

  const user = new User(userData);
  await user.save();

  // Return user without sensitive fields (toJSON handles this automatically)
  return user.toJSON();
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user ? user.toJSON() : null;
};

const getAllUsers = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const updateUser = async (id, data) => {
  const { password, ...updatedData } = data;

  const user = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  return user ? user.toJSON() : null;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user ? user.toJSON() : null;
};

const findByUsernameOrEmail = async (identifier) => {
  const users = await User.find({
    $or: [{ username: identifier }, { email: identifier }],
  });
  return users.map((user) => user.toJSON());
};

const changePassword = async (id, currentPassword, newPassword) => {
  // First, get the user with password to verify current password
  const user = await User.findById(id);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  // Verify current password using the model method
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw AppError.badRequest("Current password is incorrect");
  }

  // Update password - middleware will handle hashing and passwordUpdatedAt
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  findByUsernameOrEmail,
  changePassword,
};
