import express from "express";
import multer from "multer";
import {
  getAllLaboratories,
  getLaboratoryById,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory
} from "../../controllers/laboratoryController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

router.get("/laboratories", getAllLaboratories);
router.get("/laboratory/:id", getLaboratoryById);
router.post("/create-laboratory", upload.single("reportFile"), createLaboratory);
router.patch("/update-laboratory/:id",upload.single("reportFile"), updateLaboratory);
router.delete("/delete-laboratory/:id", deleteLaboratory);

export default router;
