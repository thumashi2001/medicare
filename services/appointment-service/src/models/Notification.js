const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"],
        index: true,
    },
    title: {
        type: String,
        required: [true, "Notification title is required"],
    },
    message: {
        type: String,
        required: [true, "Notification message is required"],
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Notification", notificationSchema);
