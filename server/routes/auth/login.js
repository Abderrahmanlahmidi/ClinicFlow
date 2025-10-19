const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Token = require("../../models/Token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../jwt/generateToken");
require("dotenv").config();


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email })
      .populate({ path: "roleId", select: "name description -_id" })
      .populate({ path: "specialityId", select: "name description -_id" });

    console.log("user info:", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Token.create({ userId: user.id, refreshToken: refreshToken });

    res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.roleId?.name || null,
        roleDescription: user.roleId.description || null,
        speciality: user.specialityId?.name ?? null,
        specialityDescription: user.specialityId.description || null,
      },
    });
  } catch (error) {
    console.log("ERROR LOGIN USER:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const storedToken = await Token.find({ token });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(403).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

const blacklistedTokens = new Set();

router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] || req.body?.token;

  if (!token) return res.status(400).json({ message: "No token provided" });

  blacklistedTokens.add(token);
  return res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
