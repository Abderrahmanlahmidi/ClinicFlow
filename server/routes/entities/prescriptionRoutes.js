import express from "express";
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} from "../../controllers/prescriptionController.js";

const router = express.Router();

router.get("/prescriptions", getPrescriptions);
router.get("/prescription/:id", getPrescriptionById);
router.post("/create-prescription", createPrescription);
router.patch("/update-prescription/:id", updatePrescription);
router.delete("/delete-prescription/:id", deletePrescription);

export default router;