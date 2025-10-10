const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const mongoose = require("mongoose");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - numberPhone
 *               - status
 *               - roleId
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               numberPhone:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, suspended]
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Server error
 */

router.get("/register", (req, res) => {
  res.send("this is register page");
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, numberPhone, roleId} =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !numberPhone ||
    !roleId
  ) {
    return res.status(400).json({ message: "Field(s) missing" });
  }
  const checkUser = await User.findOne({ email });

  if (checkUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const passwordHashed = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHashed,
      numberPhone,
      status:"suspended",
      roleId: new mongoose.Types.ObjectId(roleId),
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("ERROR REGISTERING USER:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
