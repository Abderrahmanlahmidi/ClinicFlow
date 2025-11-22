import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import Notification from "../models/Notification.js";
import User from '../models/User.js';


export const createAppointment = async (req, res) => {
    const { doctorId, patientId, date } = req.body;

    // Validate required fields
    if (!doctorId || !patientId || !date) {
        return res.status(400).json({
            message: "Please provide all required fields: doctorId, patientId, and date."
        });
    }

    // Validate MongoDB IDs
    if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
            message: "Invalid doctorId or patientId format."
        });
    }

    try {
        const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
        const patientObjectId = new mongoose.Types.ObjectId(patientId);
        const selectedDate = new Date(date);

        // Validate date format
        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date format."
            });
        }

        // Check if date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                message: "Cannot create an appointment in the past."
            });
        }

        // Set time range for the selected day
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get day of week
        const dayOfWeek = selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
        });

        // Check doctor availability
        const availability = await Availability.findOne({
            userId: doctorObjectId,
            dayOfWeek,
        });

        if (!availability) {
            return res.status(404).json({
                message: "Doctor is not available on this day."
            });
        }

        // Check if doctor is active
        const doctor = await User.findById(doctorObjectId);
        if (!doctor || doctor.status !== "active") {
            return res.status(400).json({
                message: "Doctor is not available or inactive."
            });
        }

        // Check if patient is active
        const patient = await User.findById(patientObjectId);
        if (!patient || patient.status !== "active") {
            return res.status(400).json({
                message: "Patient is not available or inactive."
            });
        }

        // Check for existing appointment for same patient with same doctor on same day
        const hasExistingAppointment = await Appointment.findOne({
            patientId: patientObjectId,
            doctorId: doctorObjectId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: "cancelled" } // Don't count cancelled appointments
        });

        if (hasExistingAppointment) {
            return res.status(409).json({
                message: "Appointment already exists for this patient with this doctor on the selected day.",
            });
        }

        // Count ACTIVE appointments for the day (excluding cancelled ones)
        const activeAppointmentsCount = await Appointment.countDocuments({
            doctorId: doctorObjectId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["cancelled"] } // Exclude cancelled appointments from count
        });

        // Check daily capacity
        if (activeAppointmentsCount >= availability.dailyCapacity) {
            return res.status(409).json({
                message: "No more appointments available for this day. Doctor has reached daily capacity."
            });
        }

        // Calculate queue number - only count non-cancelled appointments
        const queueNumber = activeAppointmentsCount + 1;

        // Create new appointment
        const newAppointment = await Appointment.create({
            date: selectedDate,
            patientId: patientObjectId,
            doctorId: doctorObjectId,
            status: "scheduled",
            queueNumber: queueNumber,
        });

        // Populate the created appointment for response
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate("patientId", "firstName lastName imageProfile numberPhone")
            .populate({
                path: "doctorId",
                select: "firstName lastName imageProfile specialityId",
                populate: {
                    path: "specialityId",
                    select: "name"
                }
            });

        // Create notification for patient
        const notification = await Notification.create({
            type: "info",
            read: false,
            title: "Appointment Scheduled",
            message: `Your appointment with Dr. ${populatedAppointment.doctorId.firstName} ${populatedAppointment.doctorId.lastName} on ${selectedDate.toLocaleDateString()} has been scheduled. Queue number: ${queueNumber}`,
            userId: patientObjectId,
        });

        // Emit real-time notification if socket is available
        if (req.io) {
            req.io.to(patientId).emit("newNotification", notification);
        }

        return res.status(201).json({
            message: "Appointment created successfully.",
            appointment: populatedAppointment,
            queueNumber: queueNumber
        });

    } catch (error) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
};



export const getDoctorAppointments = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const doctorAppointments = await Appointment.find({ doctorId }).populate(
      "patientId",
      "firstName lastName numberPhone"
    );
    if (!doctorAppointments || doctorAppointments.length === 0)
      return res
        .status(404)
        .json({
          success: false,
          message: "No appointments found for this doctor.",
        });
    return res.status(200).json({ doctorAppointments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  const patientId = req.params.id;
  try {
    const patientAppointments = await Appointment.find({ patientId }).populate(
      "doctorId",
      "firstName lastName numberPhone"
    );
    if (!patientAppointments || patientAppointments.length === 0)
      return res
        .status(404)
        .json({
          success: false,
          message: "No appointments found for this patient.",
        });
    return res.status(200).json({ patientAppointments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find()
          .populate({
              path: "patientId",
              select: "-password -email",
          })
          .populate({
              path: "doctorId",
              select: "-password -email",
              populate: {
                  path: "specialityId",
              },
          });
    if (!appointments || appointments.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No appointments found." });
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid appointment ID." });

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found." });

    const doctorId = appointment.doctorId;
    const patientId = appointment.patientId.toString();

    if (status === "cancelled") {
      appointment.status = "cancelled";
      await appointment.save();

      const notification = await Notification.create({
        type: "info",
        read: false,
        title: "Appointment Cancelled",
        message: `Your appointment on ${appointment.date.toLocaleDateString()} has been cancelled.`,
        userId: new mongoose.Types.ObjectId(appointment.patientId),
      });

      req.io.to(patientId).emit("newNotification", notification);

      return res
        .status(200)
        .json({ message: "Appointment cancelled successfully.", appointment });
    } else if (status) {
      appointment.status = status;
    }

    if (date) {
      const newDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today)
        return res
          .status(400)
          .json({ message: "Cannot update appointment to a past date." });

      const startOfDay = new Date(newDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(newDate);
      endOfDay.setHours(23, 59, 59, 999);
      const dayOfWeek = newDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const availability = await Availability.findOne({
        userId: doctorId,
        dayOfWeek,
      });
      if (!availability)
        return res
          .status(404)
          .json({ message: "Doctor is not available on this day." });

      const conflict = await Appointment.findOne({
        _id: { $ne: id },
        patientId,
        doctorId,
        date: { $gte: startOfDay, $lte: endOfDay },
      });
      if (conflict)
        return res
          .status(409)
          .json({ message: "Patient already has an appointment on this day." });

      const count = await Appointment.countDocuments({
        doctorId,
        date: { $gte: startOfDay, $lte: endOfDay },
      });
      if (count >= availability.dailyCapacity)
        return res
          .status(409)
          .json({ message: "No more appointments available for this day." });

      appointment.date = newDate;
      appointment.queueNumber = count + 1;
    }

    await appointment.save();
    return res
      .status(200)
      .json({ message: "Appointment updated successfully.", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid appointment ID." });

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment)
      return res.status(404).json({ message: "Appointment not found." });

    return res
      .status(200)
      .json({ message: "Appointment deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json({
            message: "Appointment status updated successfully",
            appointment
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
