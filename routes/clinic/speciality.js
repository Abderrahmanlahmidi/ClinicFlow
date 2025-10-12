const express = require('express');
const Speciality = require("../../models/Speciality");
const router = express.Router();


router.get("/specialities", async (req, res) => {
    try {
        const specialities = await Speciality.find();
        return res.status(200).json(specialities);
    } catch (err) {
        console.error("Error fetching specialities:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/create-speciality", async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: "Please enter name and description" });
    }

    try {
        const existingSpeciality = await Speciality.findOne({ name: name.trim() });

        if (existingSpeciality) {
            return res.status(400).json({ message: "Speciality already exists" });
        }

        const newSpeciality = await Speciality.create({
            name: name.trim(),
            description: description.trim(),
        });

        return res.status(201).json({
            message: "Successfully created speciality",
            speciality: newSpeciality,
        });
    } catch (err) {
        console.error("Error creating speciality:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});


router.get("/specialities/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const speciality = await Speciality.findById(id);
        if (!speciality) return res.status(404).json({ message: "Speciality not found" });

        return res.status(200).json(speciality);
    } catch (err) {
        console.error("Error fetching speciality:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.patch("/update-speciality/:id", async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    try {
        const speciality = await Speciality.findById(id);
        if (!speciality) return res.status(404).json({ message: "Speciality not found" });

        if (name) speciality.name = name.trim();
        if (description) speciality.description = description.trim();

        await speciality.save();
        return res.status(200).json({ message: "Speciality updated successfully", speciality });
    } catch (err) {
        console.error("Error updating speciality:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.delete("/delete-speciality/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Speciality.deleteOne({_id: id});
        if (result.deletedCount === 0) return res.status(404).json({message: "Speciality not found"});

        return res.status(200).json({message: "Speciality successfully deleted"});
    } catch (err) {
        console.error("Error deleting speciality:", err);
        return res.status(500).json({message: "Internal server error."});
    }
});


module.exports = router;