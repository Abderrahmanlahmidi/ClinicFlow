import User from "../models/User.js";
import Token from "../models/Token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../jwt/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    numberPhone,
    specialityId,
    roleId,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !numberPhone) {
    return res.status(400).json({ message: "Field(s) missing" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const role = roleId ? roleId : "68eb65a167c899cc8d931a99";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      numberPhone,
      status: "active",
      roleId: new mongoose.Types.ObjectId(role),
      specialityId: specialityId
        ? new mongoose.Types.ObjectId(specialityId)
        : null,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("ERROR REGISTERING USER:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email })
      .populate({ path: "roleId", select: "name description -_id" })
      .populate({ path: "specialityId", select: "name description -_id" });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Token.create({ userId: user._id, refreshToken });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.roleId?.name || null,
        roleDescription: user.roleId?.description || null,
        speciality: user.specialityId?.name || null,
        specialityDescription: user.specialityId?.description || null,
      },
    });
  } catch (error) {
    console.error("ERROR LOGIN USER:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const storedToken = await Token.findOne({ refreshToken: token });
    if (!storedToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(403).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const blacklistedTokens = new Set();

export const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] || req.body?.token;
  if (!token) return res.status(400).json({ message: "No token provided" });

  blacklistedTokens.add(token);
  return res.status(200).json({ message: "Logout successful" });
};
