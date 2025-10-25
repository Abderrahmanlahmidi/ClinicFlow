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
router.get("/specialities/:id", getSpecialityById);
router.get("/speciality-doctors/:id", getSpecialityDoctors);
router.patch("/update-speciality/:id", updateSpeciality);
router.delete("/delete-speciality/:id", deleteSpeciality);

export default router;
