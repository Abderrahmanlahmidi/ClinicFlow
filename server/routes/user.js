const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");
const multer = require("multer");

router.get("/users", isAuthenticated(["Admin"]), async (req, res) => {
  try {
    const users = await User.find().populate("roleId");

    if (!users) {
      return res.status(400).json({
        message: "No any User Found",
      });
    }

    return res.status(200).json({
      users: users,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only .jpeg, and .png files are allowed"), false);
  }
};

const upload = multer({storage, fileFilter})


router.patch(
  "/update-profile/:id",
  upload.single("imageProfile"),
  async (req, res) => {
    const id = req.params.id;
    const {} = req.body;

    try {
      const userInfo = await User.findById(id);

      if (!userInfo) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const { firstName, lastName, email, numberPhone } = req.body;

      if (firstName) userInfo.firstName = firstName;
      if (lastName) userInfo.lastName = lastName;
      if (email) userInfo.email = email;
      if (numberPhone) userInfo.numberPhone = numberPhone;

      if (req.file) {
        userInfo.imageProfile = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await userInfo.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        error: message.error,
      });
    }
  }
);

module.exports = router;
