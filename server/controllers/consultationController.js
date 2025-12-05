import Consultation from "../models/Consultation.js";

export const getUserConsultations = async (req, res) => {
  const { id } = req.params;
  try {
    const userConsultations = await Consultation.find({ userId: id }).populate("doctorId", "firstName lastName email imageProfile");

    if (!userConsultations || userConsultations.length === 0) {
      return res
        .status(404)
        .json({ message: "No consultations found for this user" });
    }
    return res
      .status(200)
      .json({
        message: "Consultations retrieved successfully",
        consultations: userConsultations,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDoctorConsultations = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const consultations = await Consultation.find({ doctorId: doctorId })
            .populate("userId", "firstName lastName email imageProfile")


        if (!consultations || consultations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No consultations found for this doctor"
            });
        }

        return res.status(200).json({
            success: true,
            consultations: consultations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().populate({
      path: "prescriptions",
      consultations: "Prescription",
    });
    if (!consultations || consultations.length === 0) {
      return res.status(404).json({ message: "No consultations found" });
    }
    return res
      .status(200)
      .json({ message: "Consultations retrieved successfully", consultations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createConsultation = async (req, res) => {
  const data = req.body;
  const requiredFields = [
    "consultationDate",
    "consultationReason",
    "diagnosis",
    "doctorNotes",
    "allergies",
    "bloodType",
    "weight",
    "height",
    "bloodPressure",
    "temperature",
    "respiratoryRate",
    "hearRate",
    "userId",
    "doctorId",
  ];

  const missingFields = requiredFields.filter((f) => !data[f]);
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
  }

  try {
    const newConsultation = await Consultation.create(data);
    return res
      .status(201)
      .json({
        message: "Consultation created successfully",
        consultation: newConsultation,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateConsultation = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const requiredFields = [
    "consultationDate",
    "consultationReason",
    "diagnosis",
    "doctorNotes",
    "allergies",
    "bloodType",
    "weight",
    "height",
    "bloodPressure",
    "temperature",
    "respiratoryRate",
    "hearRate",
  ];

  const missingFields = requiredFields.filter((f) => !data[f]);
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
  }

  try {
    const consultation = await Consultation.findById(id);
    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    Object.keys(data).forEach((key) => {
      consultation[key] = data[key];
    });

    await consultation.save();
    return res
      .status(200)
      .json({ message: "Consultation updated successfully", consultation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteConsultation = async (req, res) => {
  const { id } = req.params;
  try {
    const consultation = await Consultation.findById(id);
    if (!consultation)
      return res.status(404).json({ message: "Consultation not found" });

    await Consultation.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ message: "Consultation deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
