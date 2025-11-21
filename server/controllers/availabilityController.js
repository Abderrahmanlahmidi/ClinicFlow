import Availability from "../models/Availability.js";


export const getUserAvailabilities = async (req, res) => {
  const { userId } = req.params;
  try {
    const userAvailabilities = await Availability.find({ userId });
    if (!userAvailabilities || userAvailabilities.length === 0) {
      return res
        .status(404)
        .json({ message: "No availabilities found for this user" });
    }
    return res.status(200).json({ success: true, userAvailabilities });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.find().populate("userId", "firstName lastName email imageProfile");
    if (!availabilities || availabilities.length === 0) {
      return res.status(404).json({ message: "No availabilities found" });
    }
    return res.status(200).json({ success: true, availabilities });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const createAvailability = async (req, res) => {
  const { dayOfWeek, startTime, endTime, userId, dailyCapacity } = req.body;

  if (!dayOfWeek || !startTime || !endTime || !userId || !dailyCapacity) {
    return res
      .status(400)
      .json({
        message:
          "All fields are required: dayOfWeek, startTime, endTime, userId, and dailyCapacity.",
      });
  }

  const startHour = Number(startTime.split(":")[0]);
  const endHour = Number(endTime.split(":")[0]);
  if (startHour >= endHour)
    return res
      .status(400)
      .json({ message: "Start time must be earlier than end time." });

  try {
    const existingAvailability = await Availability.findOne({
      userId,
      dayOfWeek,
    });
    if (existingAvailability)
      return res
        .status(409)
        .json({
          message: "Availability already exists for this day and user.",
        });

    const newAvailability = await Availability.create({
      dayOfWeek,
      startTime,
      endTime,
      dailyCapacity,
      userId,
    });
    return res
      .status(201)
      .json({
        message: "Availability created successfully.",
        availability: newAvailability,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { dayOfWeek, startTime, endTime, dailyCapacity, userId } = req.body;

  if (!dayOfWeek && !startTime && !endTime && !dailyCapacity && !userId) {
    return res
      .status(400)
      .json({ message: "At least one field is required to update." });
  }

  try {
    const availability = await Availability.findById(id);
    if (!availability)
      return res.status(404).json({ message: "Availability not found." });

    if (startTime && endTime) {
      const startHour = Number(startTime.split(":")[0]);
      const endHour = Number(endTime.split(":")[0]);
      if (startHour >= endHour)
        return res
          .status(400)
          .json({ message: "Start time must be earlier than end time." });
    }

    if (dayOfWeek) availability.dayOfWeek = dayOfWeek;
    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;
    if (dailyCapacity) availability.dailyCapacity = dailyCapacity;
    if (userId) availability.userId = userId;

    await availability.save();
    return res
      .status(200)
      .json({ message: "Availability updated successfully.", availability });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const deleteAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Availability.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Availability not found" });
    return res
      .status(200)
      .json({ message: "Availability successfully deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
