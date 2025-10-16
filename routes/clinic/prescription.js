const express = require("express");
const router = express.Router();
const Prescription = require("../../models/Prescription");
const Consultation = require("../../models/Consultation");



router.get("/prescriptions", async (req, res) => {
    try {
        const prescriptions = await Prescription.find();
        
        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({
                message: "No prescriptions found"
            });
        }

        return res.status(200).json({
            message: "Prescriptions retrieved successfully",
            prescriptions: prescriptions
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
});


router.get("/prescription/:id", async (req, res) => {
    const prescriptionId = req.params.id;

    try {
        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        return res.status(200).json({
            message: "Prescription retrieved successfully",
            prescription: prescription
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
});



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

   const newPrescription = await Prescription.create({
      medicineName,
      dosage,
      duration,
      instructions,
      consultationId,
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
      return res.status(401).json({
          error: error.message
      })
  }

});


router.patch("/update-prescription/:id", async (req, res) => {

    const prescriptionId = req.params.id

    const {medicineName, dosage, duration, instructions} = req.body;

    try{

        const prescription = await Prescription.findById(prescriptionId);

        if(!prescription) {
            return res.status(401).json({
                message: "Prescription not found",
            })
        }

        if(medicineName) prescription.medicineName = medicineName;
        if(dosage) prescription.dosage = dosage;
        if(duration) prescription.duration = duration;
        if(instructions) prescription.instructions = instructions;
        prescription.save();

        return res.status(201).json({
            message:"Prescription updated successfully"
        })

    }catch(error){
        return res.status(401).json({
            error: error.message
        })
    }
})

router.delete("/delete-prescription/:id", async (req, res) => {
    const prescriptionId = req.params.id;

    try {
        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        await Prescription.deleteOne({ _id: prescriptionId });

        return res.status(200).json({
            message: "Prescription deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
});


module.exports = router;
