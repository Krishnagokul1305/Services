const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/ApiResponse");

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
    req.user = decoded;
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
