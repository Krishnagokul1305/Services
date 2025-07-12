const bcrypt = require("bcryptjs");

const verifyPassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

module.exports = { verifyPassword };
