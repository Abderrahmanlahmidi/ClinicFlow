import User from "../models/User.js";

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
