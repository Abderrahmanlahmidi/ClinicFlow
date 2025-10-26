import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
    {
        consultationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
            required: true,
        },
        pharmacyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pharmacy",
            required: true,
        },
        medicineName: {type: String, required: true},
        dosage: {type: String, required: true},
        duration: {type: String, required: true},
        instructions: {type: String, required: true},
        status: {
            type: String,
            enum: ["pending", "ready", "unavailable"],
            required: true,
        },
    },
    {
        collection: "Prescription",
        timestamps: true,
    }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
