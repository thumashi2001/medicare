const express = require("express");
const router = express.Router();
const {
    getHealth,
    getAllDoctors,
    getDoctorAvailability,
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
    getPrescriptionsByPatient,
    createAppointment,
    getMyAppointments,
    acceptAppointment,
    rejectAppointment
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/health", getHealth);
router.get("/", getAllDoctors);  // Public — list all doctors for patient booking
router.get("/:doctorId/availability", getDoctorAvailability);  // Public — get a doctor's available slots

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

router.post("/appointments", protect, authorize("doctor"), createAppointment);
router.get("/appointments", protect, authorize("doctor"), getMyAppointments);
router.put("/appointments/:id/accept", protect, authorize("doctor"), acceptAppointment);
router.put("/appointments/:id/reject", protect, authorize("doctor"), rejectAppointment);

module.exports = router;