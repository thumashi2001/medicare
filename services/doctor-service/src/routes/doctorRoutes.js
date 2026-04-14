const express = require("express");
const router = express.Router();
const {
    getHealth,
    createDoctorProfile,
    getDoctorProfileByUserId,
    updateDoctorProfileByUserId
} = require("../controllers/doctorController");

router.get("/health", getHealth);

router.post("/profile", createDoctorProfile);
router.get("/profile/:userId", getDoctorProfileByUserId);
router.put("/profile/:userId", updateDoctorProfileByUserId);

module.exports = router;