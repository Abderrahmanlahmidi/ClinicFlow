const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const mongoose = require("mongoose");
const isAuthenticated = require("../../middlewares/isAuthenticated");


router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, numberPhone, specialityId, roleId} = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !numberPhone
  ) {
    return res.status(400).json({ message: "Field(s) missing" });
  }
  const checkUser = await User.findOne({ email });

  if (checkUser) {
    return res.status(400).json({ message: "User already exists" });
  }


  const role = roleId ? roleId : "68eb65a167c899cc8d931a99";

  try {
    const passwordHashed = await bcrypt.hash(password, 10);

      const user = new User({
          firstName,
          lastName,
          email,
          password: passwordHashed,
          numberPhone,
          status: "active",
          roleId: new mongoose.Types.ObjectId(role),
          specialityId:  specialityId ? new mongoose.Types.ObjectId(specialityId) : null,
      });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("ERROR REGISTERING USER:", error);
    res.status(500).json({ error: error.message });
  }
});








module.exports = router;
