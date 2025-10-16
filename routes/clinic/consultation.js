const express = require("express");
const router = express.Router();
const Consultation = require("../../models/Consultation");

router.get("/user-consultations/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const userConsultations = await Consultation.findById(userId);

    if (!userConsultations || userConsultations.lenght === 0) {
      return res.status(400).json({
        message: "No consultations found",
      });
    }

    return res.status(200).json({
      message: "message get consultations successfully",
      consultations: userConsultations,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ errors: error.errors });
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
    await Consultation.create({
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

    return res.status(200).json({
      message: "Consultation created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ errors: error.errors });
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
    console.log("3)-the consultations from the db :" + consultation);

    if (!consultation) {
      return res.status(404).json({
        message: "No consultations found",
      });
    }

    consultation.consultationDate = consultationDate;
    consultation.consultationReason = consultationReason;
    consultation.diagnosis = diagnosis;
    consultation.doctorNotes = doctorNotes;
    consultation.allergies = allergies;
    consultation.bloodType = bloodType;
    consultation.weight = weight;
    consultation.height = height;
    consultation.bloodPressure = bloodPressure;
    consultation.temperature = temperature;
    consultation.respiratoryRate = respiratoryRate;
    consultation.hearRate = hearRate;
    consultation.save();

    return res.status(201).json({
      message: "Consultation Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ errors: error.errors });
  }
});


router.delete("/delete-consultation/:id", async (req, res) => {

  const consultationId = req.params.id;

  try {

    const consultation = await Consultation.findById(consultationId);

    if(!consultation){
        return res.status(401).json({
            message:"No consultation found"
        })
    }

    await Consultation.deleteOne({_id:consultationId});

    return res.status(200).json({
        message:"consultation deleted successfully"
    })  

  } catch (error) {
    console.error(error);
    res.status(400).json({ errors: error.errors });
  }
  
});



module.exports = router;
