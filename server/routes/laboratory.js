const express = require("express");
const router = express.Router();
const Laboratory = require("../models/Laboratory");
const minioClient = require("../config/minioClient");
const fs = require("fs");
const multer = require("multer");

router.get("/laboratories", async (req, res) => {
  try {
    const labs = await Laboratory.find();

    if (!labs || labs.length === 0) {
      return res.status(404).json({
        message: "No laboratories found",
      });
    }

    const labsWithUrls = [];

    for (const lab of labs) {
      let downloadUrl = null;

      if (lab.reportFileUrl) {
        downloadUrl = await minioClient.presignedGetObject(
          bucketName,
          lab.reportFileUrl,
          24 * 60 * 60
        );
      }

      labsWithUrls.push({
        ...lab.toObject(),
        downloadUrl: downloadUrl || null,
      });
    }

    return res.status(200).json({
      laboratories: labsWithUrls,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/laboratory/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const lab = await Laboratory.findById(id);

    if (!lab) {
      return res.status(400).json({
        message: "Laboratory not found",
      });
    }

    const fileName = lab.reportFileUrl;

    const url = await minioClient.presignedGetObject(
      "lab-reports",
      fileName,
      24 * 6 * 6
    );

    return res.status(200).json({
      ...lab.toObject(),
      downloadUrl: url,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

const bucketName = "lab-reports";

async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(bucketName).catch(() => false);
  if (!exists) await minioClient.makeBucket(bucketName, "us-east-1");
}
ensureBucketExists();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({ storage });

router.post(
  "/create-laboratory",
  upload.single("reportFile"),
  async (req, res) => {
    const { reportType, resultSummary, status, consultationsId, tests } =
      req.body;

    if (
      !reportType ||
      !resultSummary ||
      !status ||
      !consultationsId ||
      !req.file
    ) {
      return res.status(400).json({ message: "Fields required" });
    }

    const localPath = req.file.path;
    const fileName = req.file.filename;
    const reportUrl = fileName;

    try {
      await minioClient.fPutObject(bucketName, fileName, localPath);

      fs.unlinkSync(localPath);

      await Laboratory.create({
        reportFileUrl: reportUrl,
        reportType,
        resultSummary,
        status,
        tests: tests || [],
        consultationsId,
      });

      return res
        .status(201)
        .json({ message: "Laboratory created successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.patch("/update-laboratory/:id", async (req, res) => {
  const laboratoryId = req.params.id;

  const {
    reportFileUrl,
    reportType,
    resultSummary,
    status,
    consultationsId,
    tests,
  } = req.body;

  try {
    const laboratory = await Laboratory.findById(laboratoryId);

    if (!laboratory) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    if (reportFileUrl) laboratory.reportFileUrl = reportFileUrl;
    if (reportType) laboratory.reportType = reportType;
    if (resultSummary) laboratory.resultSummary = resultSummary;
    if (status) laboratory.status = status;
    if (consultationsId) laboratory.consultationsId = consultationsId;
    if (tests) laboratory.tests = tests || [];
    laboratory.save();

    return res.status(200).json({
      message: "Laboratory Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/delete-laboratory/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const lab = await Laboratory.findById(id);
    if (!lab) {
      return res.status(404).json({ message: "Lab record not found" });
    }


    if (lab.fileName) {
      await minioClient.removeObject("laboratory-reports", lab.fileName);
    }

    await lab.deleteOne();

    res.status(200).json({ message: "Lab record and file deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab record:", error);
    res.status(500).json({ message: "Failed to delete lab record" });
  }
});


module.exports = router;
