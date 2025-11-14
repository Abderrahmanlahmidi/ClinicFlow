import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roleId");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).populate("roleId");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const updateProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const userInfo = await User.findById(id);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
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
    return res.status(500).json({ error: error.message });
  }
};


export const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new password are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


