const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    status: {
        type: String,
        enum: ["scheduled", "in progress", "completed", "cancelled"],
        required: true
    },
    queueNumber: {type: Number, required: true},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {collection: "Appointment", timestamps: true});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
