const express = require("express");
const router = express.Router();
const {
    getUserNotifications,
    markNotificationRead,
} = require("../controllers/notificationController");

// GET /api/notifications/:userId   — All notifications for a user
router.get("/:userId", getUserNotifications);

// PUT /api/notifications/:id/read  — Mark a notification as read
router.put("/:id/read", markNotificationRead);

module.exports = router;
