import express from "express";
import {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocumentsByUser
} from "../../controllers/documentController.js";

import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();


router.post("/create-document", upload.single("file"), createDocument);


router.get("/documents", getAllDocuments);


router.get("/document/:id", getDocumentById);

router.get("/user-documents/:userId", getDocumentsByUser);

router.patch("/update-document/:id", upload.single("file"), updateDocument);


router.delete("/delete-document/:id", deleteDocument);

export default router;
