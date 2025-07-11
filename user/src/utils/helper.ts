import bcrypt from "bcryptjs";

export const verifyPassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};
