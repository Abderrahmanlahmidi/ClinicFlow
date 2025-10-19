const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

router.delete("/delete-notification/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid notification ID." });
  }

  try {
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    return res.status(200).json({
      message: "Notification deleted successfully.",
      deletedNotification: notification,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/notifications/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user." });
    }

    res.status(200).json({
      message: `${result.deletedCount} notifications deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete notifications",
      details: error.message,
    });
  }
});

router.patch("/notifications/:id/read", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      message: `${result.modifiedCount} notifications marked as read.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to update notifications",
        details: error.message,
      });
  }
});

module.exports = router;
