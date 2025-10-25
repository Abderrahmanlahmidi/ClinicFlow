import express from "express";
import {
  getUserConsultations,
  getAllConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation
} from "../../controllers/consultationController.js";

const router = express.Router();

router.get("/user-consultations/:id", getUserConsultations);
router.get("/consultations", getAllConsultations);
router.post("/create-consultation", createConsultation);
router.patch("/update-consultation/:id", updateConsultation);
router.delete("/delete-consultation/:id", deleteConsultation);

export default router;
