import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../controllers/appointmentController.js";

const router = express.Router();

router.post("/create-appointment", createAppointment);
router.get("/doctor-appointments/:id", getDoctorAppointments);
router.get("/patient-appointments/:id", getPatientAppointments);
router.get("/appointments", getAllAppointments);
router.patch("/update-appointment/:id", updateAppointment);
router.delete("/appointment/:id", deleteAppointment);

export default router;
