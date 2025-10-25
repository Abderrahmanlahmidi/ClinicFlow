import Speciality from "../models/Speciality.js";
import User from "../models/User.js";

export const getSpecialities = async (req, res) => {
  try {
    const specialities = await Speciality.find();

    if (!specialities || specialities.length === 0) {
      return res.status(404).json({ message: "No specialities found" });
    }

    return res.status(200).json({
      message: "Specialities retrieved successfully",
      specialities,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const createSpeciality = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required." });
  }

  try {
    const existingSpeciality = await Speciality.findOne({ name: name.trim() });
    if (existingSpeciality) {
      return res.status(409).json({ message: "Speciality already exists" });
    }

    const newSpeciality = await Speciality.create({
      name: name.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      message: "Speciality created successfully",
      speciality: newSpeciality,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSpecialityById = async (req, res) => {
  const id = req.params.id;

  try {
    const speciality = await Speciality.findById(id);
    if (!speciality)
      return res.status(404).json({ message: "Speciality not found" });

    return res.status(200).json({
      message: "Speciality retrieved successfully",
      speciality,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSpecialityDoctors = async (req, res) => {
  const id = req.params.id;

  try {
    const doctors = await User.find({ specialityId: id });
    if (!doctors || doctors.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found for this speciality" });
    }

    return res.status(200).json({ specialityDoctors: doctors });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSpeciality = async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  if (!name && !description) {
    return res
      .status(400)
      .json({
        message:
          "At least one field (name or description) is required to update.",
      });
  }

  try {
    const speciality = await Speciality.findById(id);
    if (!speciality)
      return res.status(404).json({ message: "Speciality not found" });

    if (name && name.trim() !== speciality.name) {
      const existingSpeciality = await Speciality.findOne({
        name: name.trim(),
      });
      if (existingSpeciality) {
        return res
          .status(409)
          .json({ message: "Speciality name already exists" });
      }
    }

    if (name) speciality.name = name.trim();
    if (description) speciality.description = description.trim();

    await speciality.save();
    return res
      .status(200)
      .json({ message: "Speciality updated successfully", speciality });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSpeciality = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Speciality.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Speciality not found" });

    return res.status(200).json({ message: "Speciality deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
