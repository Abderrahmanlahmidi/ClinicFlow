import express from "express";
import {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} from "../../controllers/documentController.js";

import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();


router.post("/create", upload.single("file"), createDocument);


router.get("/", getAllDocuments);


router.get("/:id", getDocumentById);


router.put("/:id", upload.single("file"), updateDocument);


router.delete("/:id", deleteDocument);

export default router;
