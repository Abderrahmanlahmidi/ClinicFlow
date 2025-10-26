import mongoose from "mongoose";


const documentSchema = new mongoose.Schema({
    uploadUrl: {
        type: String,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultation",
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    }
}, {collection: "Document", timestamps: true});

const Document = mongoose.model("Document", documentSchema);

export default Document;