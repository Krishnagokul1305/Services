const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY = "7d";
const JWT_REFRESH_EXPIRY = "90d";

const login = async (email, password) => {
  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw AppError.unauthorized("Invalid credentials");
  }

  const tokenIssuedAt = Math.floor(Date.now() / 1000);

  const accessToken = jwt.sign(
    { id: user._id, role: "user", iat: tokenIssuedAt },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id, type: "refresh", iat: tokenIssuedAt },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRY,
    }
  );

  // Convert to plain object and remove sensitive fields
  const userObject = user.toObject();
  const {
    password: _,
    resetToken,
    resetTokenExpiry,
    passwordUpdatedAt,
    ...safeUser
  } = userObject;

  return { user: safeUser, accessToken, refreshToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw AppError.notFound("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15);

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  console.log(
    `Reset password link: https://yourapp/reset-password?token=${token}`
  );
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gte: new Date() },
  });

  if (!user) throw AppError.badRequest("Invalid or expired token");

  // The password will be hashed automatically by the pre-save middleware
  user.password = newPassword;
  user.passwordUpdatedAt = new Date();
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();
};

const getMe = async (decoded) => {
  await validateTokenAgainstPasswordUpdate(decoded);

  return User.findById(decoded.id).select(
    "username name email avatar createdAt updatedAt"
  );
};

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
      throw AppError.unauthorized("Invalid token type");
    }

    const user = await User.findById(decoded.id);

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
      { id: user._id, role: "user", iat: newTokenIssuedAt },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, type: "refresh", iat: newTokenIssuedAt },
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
  const user = await User.findById(decoded.id).select("passwordUpdatedAt");

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
