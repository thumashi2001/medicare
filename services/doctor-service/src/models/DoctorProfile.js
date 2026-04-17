const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            default: "",
            trim: true
        },
        specialization: {
            type: String,
            required: true,
            trim: true
        },
        hospital: {
            type: String,
            default: "",
            trim: true
        },
        experience: {
            type: Number,
            default: 0
        },
        qualifications: {
            type: String,
            default: "",
            trim: true
        },
        consultationFee: {
            type: Number,
            default: 0
        },
        bio: {
            type: String,
            default: "",
            trim: true
        },
        profileImage: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);