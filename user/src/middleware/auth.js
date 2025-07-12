const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/ApiResponse.js");
const {
  validateTokenAgainstPasswordUpdate,
} = require("../service/auth.service.js");

const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(ApiResponse.error("Unauthorized"));
  }

  const token = authHeader.split(" ")[1];
  console.log("token unverified");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await validateTokenAgainstPasswordUpdate(decoded);
    req.user = decoded;
    console.log("token");
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json(ApiResponse.error(err.message || "Invalid token"));
  }
};

const isAuthorized =
  (...roles) =>
  (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user?.role)) {
      return res
        .status(403)
        .json(
          ApiResponse.error("You are not authorized to perform this action")
        );
    }
    next();
  };

module.exports = { isAuthenticated, isAuthorized };
