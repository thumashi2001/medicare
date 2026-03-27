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
    address: String
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);