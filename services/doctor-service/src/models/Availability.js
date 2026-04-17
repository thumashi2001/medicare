const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },
        dayOfWeek: {
            type: String,
            required: true,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            enum: ["online", "physical", "both"],
            default: "online"
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);