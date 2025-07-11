import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";

type CreateUserInput = {
  username: string;
  name: string;
  email: string;
  password: string;
};

type UpdateUserInput = Partial<{
  username: string;
  name: string;
  email: string;
  avatar?: string;
  password: string;
}>;

export const createUser = async (data: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  const updatedData = { ...data };

  if (data.password) {
    updatedData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: updatedData,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const findByUsernameOrEmail = async (identifier: string) => {
  return prisma.user.findMany({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
};
