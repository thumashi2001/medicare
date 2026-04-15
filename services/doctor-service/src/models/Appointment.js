const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: {
            type: String,
            required: true
        },
        patientId: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);