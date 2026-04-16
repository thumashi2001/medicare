const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: String,
            required: [true, "Patient ID is required"],
        },
        doctorId: {
            type: String,
            required: [true, "Doctor ID is required"],
        },
        doctorName: {
            type: String,
            required: [true, "Doctor name is required"],
        },
        doctorSpecialty: {
            type: String,
            required: [true, "Doctor specialty is required"],
        },
        appointmentDate: {
            type: Date,
            required: [true, "Appointment date is required"],
        },
        appointmentTime: {
            type: String,
            required: [true, "Appointment time is required"],
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
