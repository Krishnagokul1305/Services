const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../utils/prisma.js");
const AppError = require("../utils/AppError.js");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY = "7d";
const JWT_REFRESH_EXPIRY = "90d";

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw AppError.unauthorized("Invalid credentials");
  }

  const tokenIssuedAt = Math.floor(Date.now() / 1000);

  const accessToken = jwt.sign(
    { id: user.id, role: "user", iat: tokenIssuedAt },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: "refresh", iat: tokenIssuedAt },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRY,
    }
  );

  const {
    password: _,
    resetToken,
    resetTokenExpiry,
    passwordUpdatedAt,
    ...safeUser
  } = user;
  return { user: safeUser, accessToken, refreshToken };
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw AppError.notFound("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  console.log(
    `Reset password link: https://yourapp/reset-password?token=${token}`
  );
};

const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) throw AppError.badRequest("Invalid or expired token");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordUpdatedAt: new Date(),
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

const getMe = async (decoded) => {
  await validateTokenAgainstPasswordUpdate(decoded);

  return prisma.user.findUnique({
    where: { id: decoded.id },
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

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
      throw AppError.unauthorized("Invalid token type");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw AppError.unauthorized("User not found");
    }

    const tokenIssuedAt = decoded.iat;
    const passwordUpdatedAt = Math.floor(
      new Date(user.passwordUpdatedAt).getTime() / 1000
    );

    if (tokenIssuedAt < passwordUpdatedAt) {
      throw AppError.unauthorized("Token invalidated due to password change");
    }

    const newTokenIssuedAt = Math.floor(Date.now() / 1000);

    const newAccessToken = jwt.sign(
      { id: user.id, role: "user", iat: newTokenIssuedAt },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, type: "refresh", iat: newTokenIssuedAt },
      JWT_REFRESH_SECRET,
      {
        expiresIn: JWT_REFRESH_EXPIRY,
      }
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }
    throw error;
  }
};

const logout = async (userId) => {
  return { message: "Logged out successfully" };
};

const validateTokenAgainstPasswordUpdate = async (decoded) => {
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      passwordUpdatedAt: true,
    },
  });

  if (!user) {
    throw AppError.unauthorized("User not found");
  }

  const tokenIssuedAt = decoded.iat; // Token issued at (in seconds)
  const passwordUpdatedAt = Math.floor(
    new Date(user.passwordUpdatedAt).getTime() / 1000
  );

  if (tokenIssuedAt < passwordUpdatedAt) {
    throw AppError.unauthorized("Token invalidated due to password change");
  }

  return user;
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  getMe,
  refreshToken,
  logout,
  validateTokenAgainstPasswordUpdate,
};
