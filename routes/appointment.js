const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");


router.post("/create-appointment", async (req, res) => {
    const { doctorId, patientId, date } = req.body;

    if (!doctorId || !patientId || !date) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
        const patientObjectId = new mongoose.Types.ObjectId(patientId);

        const selectedDate = new Date(date);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            return res.status(400).json({ message: "Cannot create an appointment in the past." });
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

        const availability = await Availability.findOne({
            userId: doctorObjectId,
            dayOfWeek,
        });

        if (!availability) {
            return res.status(404).json({ message: "Doctor is not available on this day." });
        }

        const hasExistingAppointment = await Appointment.findOne({
            patientId: patientObjectId,
            doctorId: doctorObjectId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (hasExistingAppointment) {
            return res.status(409).json({ message: "Appointment already exists for this patient on this day." });
        }

        const count = await Appointment.countDocuments({
            doctorId: doctorObjectId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        const queueNumber = count + 1;

        if (count >= availability.dailyCapacity) {
            return res.status(409).json({ message: "No more appointments available for this day." });
        }

        const newAppointment = await Appointment.create({
            date: selectedDate,
            patientId: patientObjectId,
            doctorId: doctorObjectId,
            status: "scheduled",
            queueNumber,
        });

        return res.status(201).json({
            message: "Appointment created successfully.",
            appointment: newAppointment,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
});


router.get("/doctor-appointments/:id", async (req, res) => {

    const doctorId = req.params.id;

    console.log("doctor id: " + doctorId);

    try {
        const doctorAppointments = await Appointment.find({doctorId})
            .populate('patientId', 'firstName lastName numberPhone');

        if (!doctorAppointments || doctorAppointments.length === 0) {
            return res.status(404).json({
                success: false, message: "No appointments found for this doctor.",
            });
        }

        return res.status(200).json({
            doctorAppointments: doctorAppointments
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
});

router.get("/patient-appointments/:id", async (req, res) => {
    const patientId = req.params.id;

    try{
        const patientAppointments = await Appointment.find({patientId}).populate("doctorId", 'firstName lastName numberPhone')
        
        if (!patientAppointments || patientAppointments.length === 0) {
            return res.status(404).json({
                success: false, message: "No appointments found for this patient.",
            });
        }

        return res.status(200).json({
            patientAppointments:patientAppointments
        })


    }catch(error){
          return res.status(500).json({
            error: error.message
        })
    }
    
})


router.get("/appointments", async (req, res) => {

    try {
        const appointments = await Appointment.find();

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false, message: "No appointments found."
            })
        }

        return res.status(200).json({
            success: true, appointments: appointments
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
})


router.patch("/update-appointment/:id", async (req, res) => {

    const { id } = req.params;
    const { date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
    }

    if (!date) {
        return res.status(400).json({ message: "Please provide a new date to update." });
    }

    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const doctorId = appointment.doctorId;
        const patientId = appointment.patientId;

        const newDate = new Date(date);

        const today = new Date();
        today.setHours(0,0,0,0);
        if (newDate < today) {
            return res.status(400).json({ message: "Cannot update appointment to a past date." });
        }

        const startOfDay = new Date(newDate);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(newDate);
        endOfDay.setHours(23,59,59,999);

        const dayOfWeek = newDate.toLocaleDateString("en-US", { weekday: "long" });
        const availability = await Availability.findOne({ userId: doctorId, dayOfWeek });
        if (!availability) {
            return res.status(404).json({ message: "Doctor is not available on this day." });
        }

        const conflict = await Appointment.findOne({
            _id: { $ne: id },
            patientId,
            doctorId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (conflict) {
            return res.status(409).json({ message: "Patient already has an appointment on this day." });
        }

        const count = await Appointment.countDocuments({
            doctorId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (count >= availability.dailyCapacity) {
            return res.status(409).json({ message: "No more appointments available for this day." });
        }

        appointment.date = newDate;
        appointment.queueNumber = count + 1;
        await appointment.save();

        return res.status(200).json({
            message: "Appointment updated successfully.",
            appointment
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }

});


router.delete("/appointment/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
    }

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        return res.status(200).json({
            message: "Appointment deleted successfully.",
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
});



module.exports = router;