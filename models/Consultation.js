const mongoose = require("mongoose");


const consultationSchema = new mongoose.Schema({
  consultationDate: { type: Date, required: true },
  consultationReason: { type: String, required: true },
  diagnosis: { type: String, required: true },
  prescribedTreatment: { type: String, required: true },
  doctorNotes: { type: String, required: true },
  allergies: { type: String, required: true },
  bloodType: { type: String, required: true },
  weight: { type: Number, required: true }, 
  bloodPressure: { type: String, required: true },
  temperature: { type: Number, required: true }, 
  respiratoryRate: { type: Number, required: true }, 
  hearRate: { type: Number, required: true },
  height: { type: Number, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
