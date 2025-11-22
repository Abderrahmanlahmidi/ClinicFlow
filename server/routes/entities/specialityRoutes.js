import express from "express";
import {
  getSpecialities,
  createSpeciality,
  getSpecialityById,
  getSpecialityDoctors,
  updateSpeciality,
  deleteSpeciality,
} from "../../controllers/specialityController.js";

const router = express.Router();

router.get("/specialities", getSpecialities);
router.post("/create-speciality", createSpeciality);
router.patch("/update-speciality/:id", updateSpeciality);
router.delete("/delete-speciality/:id", deleteSpeciality);
router.get("/specialities/:id", getSpecialityById);
router.get("/speciality-doctors/:id", getSpecialityDoctors);

export default router;
