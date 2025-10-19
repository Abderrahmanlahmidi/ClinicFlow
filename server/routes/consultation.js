const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");

router.get("/user-consultations/:id", async (req, res) => {
  const userId = req.params.id;

  try {

    const userConsultations = await Consultation.find({
      userId: userId,
    }).populate({ path: "prescriptions", consultations: "Prescription" });

    if (!userConsultations || userConsultations.length === 0) {
      return res.status(404).json({
        message: "No consultations found for this user",
      });
    }

    return res.status(200).json({
      message: "Consultations retrieved successfully",
      consultations: userConsultations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/consultations", async (req, res) => {

  try {
    
    const consultations = await Consultation.find().populate({ path: "prescriptions", consultations: "Prescription" });

    if (!consultations || consultations.length === 0) {
      return res.status(404).json({
        message: "No consultations found for this user",
      });
    }

    return res.status(200).json({
      message: "Consultations retrieved successfully",
      consultations: consultations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

router.post("/create-consultation", async (req, res) => {
  const {
    consultationDate,
    consultationReason,
    diagnosis,
    doctorNotes,
    allergies,
    bloodType,
    weight,
    height,
    bloodPressure,
    temperature,
    respiratoryRate,
    hearRate,
    userId,
    doctorId,
  } = req.body;

  if (
    !consultationDate ||
    !consultationReason ||
    !diagnosis ||
    !doctorNotes ||
    !allergies ||
    !bloodType ||
    !weight ||
    !height ||
    !bloodPressure ||
    !temperature ||
    !respiratoryRate ||
    !hearRate ||
    !userId ||
    !doctorId
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newConsultation = await Consultation.create({
      consultationDate,
      consultationReason,
      diagnosis,
      doctorNotes,
      allergies,
      bloodType,
      weight,
      height,
      bloodPressure,
      temperature,
      respiratoryRate,
      hearRate,
      userId,
      doctorId,
    });

    return res.status(201).json({
      message: "Consultation created successfully",
      consultation: newConsultation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/update-consultation/:id", async (req, res) => {
  const consultationId = req.params.id;

  const {
    consultationDate,
    consultationReason,
    diagnosis,
    doctorNotes,
    allergies,
    bloodType,
    weight,
    height,
    bloodPressure,
    temperature,
    respiratoryRate,
    hearRate,
  } = req.body;

  if (
    !consultationDate ||
    !consultationReason ||
    !diagnosis ||
    !doctorNotes ||
    !allergies ||
    !bloodType ||
    !weight ||
    !height ||
    !bloodPressure ||
    !temperature ||
    !respiratoryRate ||
    !hearRate
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found",
      });
    }

    if (consultationDate) consultation.consultationDate = consultationDate;
    if (consultationReason) consultation.consultationReason = consultationReason;
    if (diagnosis) consultation.diagnosis = diagnosis;
    if (doctorNotes) consultation.doctorNotes = doctorNotes;
    if (allergies) consultation.allergies = allergies;
    if (bloodType) consultation.bloodType = bloodType;
    if (weight) consultation.weight = weight;
    if (height) consultation.height = height;
    if (bloodPressure) consultation.bloodPressure = bloodPressure;
    if (temperature) consultation.temperature = temperature;
    if (respiratoryRate) consultation.respiratoryRate = respiratoryRate;
    if (hearRate) consultation.hearRate = hearRate;
    await consultation.save();

    return res.status(200).json({
      message: "Consultation updated successfully",
      consultation: consultation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-consultation/:id", async (req, res) => {
  const consultationId = req.params.id;

  try {
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found",
      });
    }

    await Consultation.deleteOne({ _id: consultationId });

    return res.status(200).json({
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
