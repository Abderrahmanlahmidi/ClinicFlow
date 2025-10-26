import Laboratory from "../models/Laboratory.js";
import minioClient from "../config/minioClient.js";
import fs from "fs";

const bucketName = "lab-reports";

async function ensureBucketExists() {
    const exists = await minioClient.bucketExists(bucketName).catch(() => false);
    if (!exists) await minioClient.makeBucket(bucketName, "us-east-1");
}

ensureBucketExists();

// GET all laboratories
export const getAllLaboratories = async (req, res) => {
    try {
        const labs = await Laboratory.find().populate("tests");
        if (!labs.length) return res.status(404).json({ message: "No laboratories found" });

        const labsWithUrls = await Promise.all(
            labs.map(async (lab) => {
                let downloadUrl = null;
                if (lab.reportFileUrl) {
                    downloadUrl = await minioClient.presignedGetObject(bucketName, lab.reportFileUrl, 24 * 60 * 60);
                }
                return { ...lab.toObject(), downloadUrl };
            })
        );

        res.status(200).json({ laboratories: labsWithUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET single laboratory
export const getLaboratoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const lab = await Laboratory.findById(id).populate("tests");
        if (!lab) return res.status(404).json({ message: "Laboratory not found" });

        let downloadUrl = null;
        if (lab.reportFileUrl) {
            downloadUrl = await minioClient.presignedGetObject(bucketName, lab.reportFileUrl, 24 * 60 * 60);
        }

        res.status(200).json({ ...lab.toObject(), downloadUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE laboratory
export const createLaboratory = async (req, res) => {
    const { reportType, resultSummary, status, consultationsId, tests } = req.body;
    if (!reportType || !resultSummary || !status || !consultationsId || !req.file)
        return res.status(400).json({ message: "Fields required" });

    const localPath = req.file.path;
    const fileName = req.file.filename;

    try {
        await minioClient.fPutObject(bucketName, fileName, localPath);
        fs.unlinkSync(localPath);

        const lab = await Laboratory.create({
            reportFileUrl: fileName,
            reportType,
            resultSummary,
            status,
            tests: tests || [],
            consultationsId,
        });

        res.status(201).json({ message: "Laboratory created successfully", lab });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE laboratory
export const updateLaboratory = async (req, res) => {
    const { id } = req.params;
    const { reportType, resultSummary, status, consultationsId, tests } = req.body;

    try {
        const lab = await Laboratory.findById(id);
        if (!lab) return res.status(404).json({ message: "Laboratory not found" });

        // إذا كان كاين ملف جديد
        if (req.file) {
            // حذف الملف القديم من MinIO
            if (lab.reportFileUrl) {
                try {
                    await minioClient.removeObject(bucketName, lab.reportFileUrl);
                } catch (err) {
                    console.warn("Old file not found in MinIO, skipping delete");
                }
            }

            const newFileName = req.file.filename;
            await minioClient.fPutObject(bucketName, newFileName, req.file.path);
            fs.unlinkSync(req.file.path);

            lab.reportFileUrl = newFileName;
        }

        if (reportType) lab.reportType = reportType;
        if (resultSummary) lab.resultSummary = resultSummary;
        if (status) lab.status = status;
        if (consultationsId) lab.consultationsId = consultationsId;
        if (tests) lab.tests = tests;

        await lab.save();

        res.status(200).json({ message: "Laboratory updated successfully", lab });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE laboratory
export const deleteLaboratory = async (req, res) => {
    const { id } = req.params;
    try {
        const lab = await Laboratory.findById(id);
        if (!lab) return res.status(404).json({ message: "Laboratory not found" });

        if (lab.reportFileUrl) {
            try {
                await minioClient.removeObject(bucketName, lab.reportFileUrl);
            } catch (err) {
                console.warn("File not found in MinIO, skipping delete");
            }
        }

        await lab.deleteOne();
        res.status(200).json({ message: "Laboratory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
