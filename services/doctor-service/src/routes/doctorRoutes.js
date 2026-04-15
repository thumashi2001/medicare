const express = require("express");
const router = express.Router();
const {
    getHealth,
    createDoctorProfile,
    getMyDoctorProfile,
    updateMyDoctorProfile,
    createAvailability,
    getMyAvailability,
    updateAvailabilityById,
    deleteAvailabilityById
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/health", getHealth);

router.post("/profile", protect, authorize("doctor"), createDoctorProfile);
router.get("/profile/me", protect, authorize("doctor"), getMyDoctorProfile);
router.put("/profile/me", protect, authorize("doctor"), updateMyDoctorProfile);

router.post("/availability", protect, authorize("doctor"), createAvailability);
router.get("/availability/me", protect, authorize("doctor"), getMyAvailability);
router.put("/availability/:id", protect, authorize("doctor"), updateAvailabilityById);
router.delete("/availability/:id", protect, authorize("doctor"), deleteAvailabilityById);

module.exports = router;