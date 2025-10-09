const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Role = require("../../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/login", (req, res) => {
  res.send("login page");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email }).populate({
      path: "roleId",
      select: "name description -_id",
    });

    console.log("user info:", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.roleId?.name || null,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.roleId?.name || null,
        description:user.roleId.description || null
      },
    });
  } catch (error) {
    console.log("ERROR LOGIN USER:", error);
    res.status(500).json({ error: "Server error" });
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
