import Document from "../models/Document.js";
import minioClient from "../config/minioClient.js";
import fs from "fs";

const bucketName = "patient-documents";

export const createDocument = async (req, res) => {
    const { patientId, uploaderId, consultationId, documentType, fileSize } = req.body;

    if (!patientId || !uploaderId || !consultationId || !documentType || !fileSize || !req.file) {
        return res.status(400).json({ message: "Missing required fields or file" });
    }

    const localPath = req.file.path;
    const fileName = req.file.filename;

    try {

        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName);
        }


        await minioClient.fPutObject(bucketName, fileName, localPath);

        fs.unlinkSync(localPath);

        const newDocument = new Document({
            patientId,
            uploaderId,
            consultationId,
            documentType,
            fileUrl: `${bucketName}/${fileName}`,
            fileSize,
        });

        const savedDoc = await newDocument.save();
        res.status(201).json(savedDoc);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getDocumentById = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id);
        if (!document) return res.status(404).json({ error: "Document not found" });
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedDoc = await Document.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedDoc) return res.status(404).json({ error: "Document not found" });
        res.status(200).json(updatedDoc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ error: "Document not found" });


        const fileName = doc.fileUrl.split("/")[1];
        await minioClient.removeObject(bucketName, fileName);

        await doc.remove();

        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
