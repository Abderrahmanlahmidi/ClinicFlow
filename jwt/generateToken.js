const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateRefreshToken = (user) => {
  return  jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};






module.exports = { generateAccessToken, generateRefreshToken };
