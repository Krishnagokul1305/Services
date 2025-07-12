const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma.js");
const AppError = require("../utils/AppError.js");

const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      ...data,
      avatar:
        "https://s3-cdn-practise-bucket.s3.ap-south-1.amazonaws.com/uploads/default-profile.jpg",
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUser = async (id, data) => {
  const { password, ...updatedData } = data;

  return prisma.user.update({
    where: { id },
    data: updatedData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

const findByUsernameOrEmail = async (identifier) => {
  return prisma.user.findMany({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const changePassword = async (id, currentPassword, newPassword) => {
  // First, get the user with password to verify current password
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw AppError.notFound("User not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw AppError.badRequest("Current password is incorrect");
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: {
      password: hashedNewPassword,
      passwordUpdatedAt: new Date(), // Update password timestamp
    },
  });

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
