const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    required: true 
  },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;