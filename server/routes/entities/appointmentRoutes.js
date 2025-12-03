import express from "express";
import {
    createAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    getAllAppointments,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    assignNurseToAppointment, getNurseAppointments
} from "../../controllers/appointmentController.js";

const router = express.Router();

router.get("/doctor-appointments/:id", getDoctorAppointments);
router.get("/patient-appointments/:id", getPatientAppointments);
router.get("/nurse-appointments/:id", getNurseAppointments);

router.get("/appointments", getAllAppointments);
router.post("/create-appointment", createAppointment);
router.patch("/update-appointment/:id", updateAppointment);
router.delete("/appointment/:id", deleteAppointment);
router.patch('/update-appointment-status/:id', updateAppointmentStatus);
router.put('/appointments/assign-nurse/:id', assignNurseToAppointment);



export default router;
