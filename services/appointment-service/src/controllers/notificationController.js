const Notification = require("../models/Notification");

// @desc  Get all notifications for a user, sorted newest first
// @route GET /api/notifications/:userId
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.params.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error("getUserNotifications error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc  Mark a single notification as read
// @route PUT /api/notifications/:id/read
const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res
                .status(404)
                .json({ success: false, message: "Notification not found" });
        }

        return res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error("markNotificationRead error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getUserNotifications, markNotificationRead };
