import Laboratory from "../models/Laboratory.js";
import minioClient from "../config/minioClient.js";
import fs from "fs";

const bucketName = "lab-reports";

async function ensureBucketExists() {
    const exists = await minioClient.bucketExists(bucketName).catch(() => false);
    if (!exists) await minioClient.makeBucket(bucketName, "us-east-1");
}

ensureBucketExists();

export const getAllLaboratories = async (req, res) => {
    try {
        const labs = await Laboratory.find().populate("tests");
        if (!labs || labs.length === 0)
            return res.status(404).json({message: "No laboratories found"});

        const labsWithUrls = await Promise.all(
            labs.map(async (lab) => {
                let downloadUrl = null;
                if (lab.reportFileUrl) {
                    downloadUrl = await minioClient.presignedGetObject(
                        bucketName,
                        lab.reportFileUrl,
                        24 * 60 * 60
                    );
                }
                return {...lab.toObject(), downloadUrl: downloadUrl || null};
            })
        );

        res.status(200).json({laboratories: labsWithUrls});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getLaboratoryById = async (req, res) => {
    const {id} = req.params;
    try {
        const lab = await Laboratory.findById(id).populate("tests");
        if (!lab) return res.status(404).json({message: "Laboratory not found"});

        const url = await minioClient.presignedGetObject(
            bucketName,
            lab.reportFileUrl,
            24 * 6 * 6
        );
        res.status(200).json({...lab.toObject(), downloadUrl: url});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const createLaboratory = async (req, res) => {
    const {reportType, resultSummary, status, consultationsId, tests} =
        req.body;
    if (!reportType || !resultSummary || !status || !consultationsId || !req.file)
        return res.status(400).json({message: "Fields required"});

    const localPath = req.file.path;
    const fileName = req.file.filename;

    try {
        await minioClient.fPutObject(bucketName, fileName, localPath);
        fs.unlinkSync(localPath);
        await Laboratory.create({
            reportFileUrl: fileName,
            reportType,
            resultSummary,
            status,
            tests: tests || [],
            consultationsId,
        });
        res.status(201).json({message: "Laboratory created successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const updateLaboratory = async (req, res) => {
    const {id} = req.params;
    const {
        reportFileUrl,
        reportType,
        resultSummary,
        status,
        consultationsId,
        tests,
    } = req.body;
    try {
        const lab = await Laboratory.findById(id);
        if (!lab) return res.status(404).json({message: "Laboratory not found"});
        if (reportFileUrl) lab.reportFileUrl = reportFileUrl;
        if (reportType) lab.reportType = reportType;
        if (resultSummary) lab.resultSummary = resultSummary;
        if (status) lab.status = status;
        if (consultationsId) lab.consultationsId = consultationsId;
        if (tests) lab.tests = tests || [];
        await lab.save();
        res.status(200).json({message: "Laboratory updated successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const deleteLaboratory = async (req, res) => {
    const {id} = req.params;
    try {
        const lab = await Laboratory.findById(id);
        if (!lab) return res.status(404).json({message: "Lab record not found"});
        if (lab.fileName) await minioClient.removeObject(bucketName, lab.fileName);
        await lab.deleteOne();
        res.status(200).json({message: "Lab record deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Failed to delete lab record"});
    }
};
