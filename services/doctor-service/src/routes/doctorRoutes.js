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
    deleteAvailabilityById,
    createPrescription,
    getMyPrescriptions,
    getPrescriptionById,
    getPrescriptionsByPatient
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

router.post("/prescriptions", protect, authorize("doctor"), createPrescription);
router.get("/prescriptions", protect, authorize("doctor"), getMyPrescriptions);
router.get("/prescriptions/:id", protect, authorize("doctor"), getPrescriptionById);
router.get("/patient/:patientId/prescriptions", protect, authorize("doctor"), getPrescriptionsByPatient);

module.exports = router;