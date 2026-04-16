const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
    {
        doctorId: {
            type: String,
            required: true
        },
        patientId: {
            type: String,
            required: true
        },
        appointmentId: {
            type: String,
            default: ""
        },
        diagnosis: {
            type: String,
            required: true,
            trim: true
        },
        medicines: [
            {
                name: { type: String, required: true },
                dosage: { type: String, required: true },
                duration: { type: String, required: true }
            }
        ],
        notes: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);