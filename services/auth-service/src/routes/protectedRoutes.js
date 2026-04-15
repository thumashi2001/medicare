const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

//Only logged in users
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected profile accessed",
        user: req.user
    });
});

//Only doctors
router.get("/doctor", protect, authorize("doctor"), (req, res) => {
    res.json({ message: "Doctor access granted" });
});

//Only admin
router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Admin access granted" });
});

module.exports = router;