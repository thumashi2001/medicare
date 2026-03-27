const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    gender: String,
    phone: String,
    address: String,
    reports: [
        {
            filePath: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);