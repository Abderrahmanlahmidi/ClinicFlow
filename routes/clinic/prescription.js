const express = require("express");
const router = express.Router();
const Prescription = require("../../models/Prescription");

router.post("/create-prescription", async (req, res) => {
  const { medicineName, dosage, duration, instructions, consultationId } = req.body;

  if (
    !medicineName ||
    !dosage ||
    !duration ||
    !instructions ||
    !consultationId
  ) {
    return res.status(401).json({
      message: "required Fields",
    });
  }

  try {

    await Prescription.create({
      medicineName: medicineName,
      dosage: dosage,
      duration: duration,
      instructions: instructions,
      consultationId: consultationId,
    });

    return res.status(201).json({
        message:"Prescription created successfully"
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }

});


router.patch("/update-prescription/:id", async (req, res) => {

    const prescriptionId = req.params.id

    const {medicineName, dosage, duration, instructions} = req.body;

    try{

        const prescription = await Prescription.findById(prescriptionId);

        if
        
        
        

    }catch(error){

    }
    
    
})


module.exports = router;
