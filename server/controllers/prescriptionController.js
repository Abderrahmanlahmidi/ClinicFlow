import mongoose from "mongoose";
import Prescription from "../models/Prescription.js";
import Consultation from "../models/Consultation.js";
import Notification from "../models/Notification.js";

export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found" });
    }
    return res.status(200).json({
      message: "Prescriptions retrieved successfully",
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    return res.status(200).json({
      message: "Prescription retrieved successfully",
      prescription,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createPrescription = async (req, res) => {
  const { medicineName, dosage, duration, instructions, consultationId, status, pharmacyId } = req.body;

  if (!medicineName || !dosage || !duration || !instructions || !status || !consultationId || !pharmacyId) {
    return res.status(401).json({ message: "Required fields missing" });
  }

  try {
    const newPrescription = await Prescription.create({
      medicineName,
      dosage,
      duration,
      instructions,
      status,
      consultationId,
      pharmacyId,
    });

    await Consultation.findByIdAndUpdate(
      consultationId,
      { $push: { prescriptions: newPrescription._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Prescription created and linked successfully",
      prescription: newPrescription,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  const { id } = req.params;
  const { medicineName, dosage, duration, instructions, status } = req.body;

  try {
    const prescription = await Prescription.findById(id).populate("consultationId");
    if (!prescription) {
      return res.status(401).json({ message: "Prescription not found" });
    }

    if (medicineName) prescription.medicineName = medicineName;
    if (dosage) prescription.dosage = dosage;
    if (duration) prescription.duration = duration;
    if (instructions) prescription.instructions = instructions;
    if (status) prescription.status = status;
    await prescription.save();

    const patientId = prescription.consultationId.userId.toString();

    if (status === "ready") {
      const notification = await Notification.create({
        type: "info",
        read: false,
        title: "Prescription Ready",
        message: `Your prescription for ${prescription.medicineName} is now ready for pickup.`,
        userId: new mongoose.Types.ObjectId(patientId),
      });

      req.io.to(patientId).emit("newNotification", notification);
    }

    if (status === "unavailable") {
      const notification = await Notification.create({
        type: "warning",
        read: false,
        title: "Medication Unavailable",
        message: `We're sorry, but the medicine "${prescription.medicineName}" is currently unavailable at the pharmacy. Please contact your doctor or another pharmacy for assistance.`,
        userId: new mongoose.Types.ObjectId(patientId),
      });

      req.io.to(patientId).emit("newNotification", notification);
    }

    return res.status(201).json({ message: "Prescription updated successfully" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  const { id } = req.params;

  try {
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await Prescription.deleteOne({ _id: id });

    return res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
