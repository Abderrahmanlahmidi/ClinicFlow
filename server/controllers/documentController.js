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
            fileSize,
            fileUrl: `${bucketName}/${fileName}`,
            uploadUrl: `http://localhost:9000/${bucketName}/${fileName}`
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
        const document = await Document.findById(id)
            .populate("uploaderId")
            .populate({
                path: "consultationId",
                populate: { path: "userId" }
            });

        if (!document) return res.status(404).json({ error: "Document not found" });


        const fileName = document.fileUrl.replace(`${bucketName}/`, "");

        try {

            const presignedUrl = await minioClient.presignedGetObject(bucketName, fileName, 3600);

            res.status(200).json({
                document,
                fileUrl: presignedUrl
            });

        } catch (err) {
            return res.status(500).json({ error: "Cannot generate download URL" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const document = await Document.findById(id);
        if (!document) return res.status(404).json({ error: "Document not found" });

        if (req.file) {
            const oldFileName = document.fileUrl.replace(`${bucketName}/`, "");


            try {
                await minioClient.removeObject(bucketName, oldFileName);
            } catch (err) {
                console.warn("Old file not found in MinIO, skipping delete");
            }


            const newFileName = req.file.filename;
            await minioClient.fPutObject(bucketName, newFileName, req.file.path);


            fs.unlinkSync(req.file.path);

            updates.fileUrl = `${bucketName}/${newFileName}`;
            updates.fileSize = req.file.size;
        }

        const updatedDoc = await Document.findByIdAndUpdate(id, updates, { new: true })
            .populate("uploaderId")
            .populate({ path: "consultationId", populate: { path: "userId" } });

        res.status(200).json(updatedDoc);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getDocumentsByUser = async (req, res) => {
    const { userId } = req.params;

    try {

        const documents = await Document.find({
            $or: [
                { uploaderId: userId },
                { patientId: userId }
            ]
        })
            .populate("uploaderId")
            .populate({ path: "consultationId", populate: { path: "userId" } });

        if (!documents.length) return res.status(404).json({ error: "No documents found for this user" });

        const documentsWithUrls = await Promise.all(documents.map(async doc => {
            const fileName = doc.fileUrl.replace(`${bucketName}/`, "");
            const presignedUrl = await minioClient.presignedGetObject(bucketName, fileName, 3600);
            return {
                ...doc.toObject(),
                fileUrl: presignedUrl
            };
        }));

        res.status(200).json(documentsWithUrls);

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

        await doc.deleteOne();

        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};