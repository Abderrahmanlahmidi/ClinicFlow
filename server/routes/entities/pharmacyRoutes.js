import express from "express";
import {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy
} from "../../controllers/pharmacyController.js";

const router = express.Router();

router.post("/create-pharmacy", createPharmacy);
router.get("/pharmacies", getPharmacies);
router.get("/pharmacy/:id", getPharmacyById);
router.patch("/update-pharmacy/:id", updatePharmacy);
router.delete("/delete-pharmacy/:id", deletePharmacy);

export default router;
