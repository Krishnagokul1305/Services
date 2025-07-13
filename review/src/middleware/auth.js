const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/ApiResponse");
const axios = require("axios");

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:8001";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.unauthorized("Access token is required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResponse = await axios.get(
      `${USER_SERVICE_URL}/api/users/${decoded.id}`
    );
    if (!userResponse.data.success) {
      return res.status(404).json(ApiResponse.notFound("User not found"));
    }
    const userData = await userResponse?.data?.data[0];
    req.user = userData;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(ApiResponse.unauthorized("Token has expired"));
    }
    return res.status(403).json(ApiResponse.forbidden("Invalid token"));
  }
};

module.exports = {
  authenticateToken,
};
