import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    consultationDate: { type: Date, required: true },
    consultationReason: { type: String, required: true },
    diagnosis: { type: String, required: true },
    doctorNotes: { type: String, required: true },
    allergies: { type: String, required: true },
    bloodType: { type: String, required: true },
    weight: { type: Number, required: true },
    bloodPressure: { type: String, required: true },
    temperature: { type: Number, required: true },
    respiratoryRate: { type: Number, required: true },
    hearRate: { type: Number, required: true },
    height: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
  },
  {
    collection: "Consultation",
    timestamps: true,
  }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
