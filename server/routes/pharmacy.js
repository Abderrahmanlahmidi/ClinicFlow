const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");

router.post("/create-pharmacy", async (req, res) => {
    const {name, address, phoneNumber, emailAddress, openingHours, latitude, longitude, prescriptionsIds} = req.body;

    if (!name || !address || !phoneNumber || !emailAddress || !openingHours || !latitude || !longitude) {
        return res.status(400).json({message: 'Fields are required'});
    }

    try {
        const newPharmacy = await Pharmacy.create({
            name,
            address,
            phoneNumber,
            emailAddress,
            openingHours,
            latitude,
            longitude,
            prescriptions: prescriptionsIds || []
        });

        return res.status(201).json({
            message: "Pharmacy created successfully",
            pharmacy: newPharmacy
        });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.get("/pharmacies", async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find().populate("prescriptions");
        return res.status(200).json(pharmacies);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.get("/pharmacy/:id", async (req, res) => {

    const id = req.params.id
    try {
        const pharmacy = await Pharmacy.findById(id).populate("prescriptions");
        if (!pharmacy) return res.status(404).json({message: "Pharmacy not found"});
        return res.status(200).json(pharmacy);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.patch("/update-pharmacy/:id", async (req, res) => {
    const {name, address, phoneNumber, emailAddress, openingHours, latitude, longitude, prescriptionsIds} = req.body;

    try {
        const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
            req.params.id,
            {
                name,
                address,
                phoneNumber,
                emailAddress,
                openingHours,
                latitude,
                longitude,
                prescriptions: prescriptionsIds || []
            },
            {new: true}
        );

        if (!updatedPharmacy) return res.status(404).json({message: "Pharmacy not found"});

        return res.status(200).json({
            message: "Pharmacy updated successfully",
            pharmacy: updatedPharmacy
        });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});


router.delete("/delete-pharmacy/:id", async (req, res) => {
    try {
        const deletedPharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!deletedPharmacy) return res.status(404).json({message: "Pharmacy not found"});

        return res.status(200).json({message: "Pharmacy deleted successfully"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

module.exports = router;
