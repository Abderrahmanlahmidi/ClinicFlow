import express from "express";
import {
  deleteNotificationById,
  deleteNotificationsByUser,
  markNotificationsRead
} from "../../controllers/notificationController.js";

const router = express.Router();

router.delete("/delete-notification/:id", deleteNotificationById);
router.delete("/notifications/user/:userId", deleteNotificationsByUser);
router.patch("/notifications/:userId/read", markNotificationsRead);

export default router;
