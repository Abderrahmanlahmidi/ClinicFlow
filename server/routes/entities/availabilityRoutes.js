import express from "express";
import {
  getUserAvailabilities,
  getAllAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability
} from "../../controllers/availabilityController.js";

const router = express.Router();

router.get("/availabilities/:userId", getUserAvailabilities);
router.get("/availabilities", getAllAvailabilities);
router.post("/create-availability", createAvailability);
router.put("/update-availability/:id", updateAvailability);
router.delete("/delete-availability/:id", deleteAvailability);

export default router;
