const {
  login,
  forgotPassword,
  resetPassword,
  getMe,
  refreshToken,
  logout,
} = require("../service/auth.service.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(ApiResponse.error("Email and password are required"));
  }

  try {
    const { user, accessToken, refreshToken } = await login(email, password);
    res
      .status(200)
      .json(ApiResponse.success([{ ...user, accessToken, refreshToken }]));
  } catch (error) {
    res.status(401).json(ApiResponse.error(error.message));
  }
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json(ApiResponse.error("Email is required"));

  try {
    await forgotPassword(email);
    res.status(200).json(ApiResponse.success([]));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

const resetPasswordController = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json(ApiResponse.error("Token and new password are required"));
  }

  try {
    await resetPassword(token, newPassword);
    res.status(200).json(ApiResponse.success([]));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

const meController = async (req, res) => {
  try {
    const user = await getMe(req.user);
    if (!user) return res.status(404).json(ApiResponse.error("User not found"));
    res.status(200).json(ApiResponse.success([user]));
  } catch (error) {
    res.status(401).json(ApiResponse.error(error.message));
  }
};

const refreshTokenController = async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(400).json(ApiResponse.error("Refresh token is required"));
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await refreshToken(
      token
    );
    res
      .status(200)
      .json(
        ApiResponse.success([{ accessToken, refreshToken: newRefreshToken }])
      );
  } catch (error) {
    res.status(401).json(ApiResponse.error(error.message));
  }
};

const logoutController = async (req, res) => {
  try {
    await logout(req.user.id);
    res
      .status(200)
      .json(ApiResponse.success([{ message: "Logged out successfully" }]));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

module.exports = {
  loginController,
  forgotPasswordController,
  resetPasswordController,
  meController,
  refreshTokenController,
  logoutController,
};
