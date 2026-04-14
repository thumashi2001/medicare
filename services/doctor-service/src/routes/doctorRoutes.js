const express = require("express");
const router = express.Router();
const {
    getHealth,
    createDoctorProfile,
    getDoctorProfileByUserId,
    updateDoctorProfileByUserId,
    createAvailability,
    getAvailabilityByUserId,
    updateAvailabilityById,
    deleteAvailabilityById
} = require("../controllers/doctorController");

router.get("/health", getHealth);

router.post("/profile", createDoctorProfile);
router.get("/profile/:userId", getDoctorProfileByUserId);
router.put("/profile/:userId", updateDoctorProfileByUserId);

router.post("/availability", createAvailability);
router.get("/availability/:userId", getAvailabilityByUserId);
router.put("/availability/:id", updateAvailabilityById);
router.delete("/availability/:id", deleteAvailabilityById);

module.exports = router;