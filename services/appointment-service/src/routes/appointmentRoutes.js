const express = require("express");
const router = express.Router();
const {
    createAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
} = require("../controllers/appointmentController");

// POST   /api/appointments          — Create new appointment
router.post("/", createAppointment);

// GET    /api/appointments/patient/:id — All appointments for a patient
router.get("/patient/:id", getPatientAppointments);

// GET    /api/appointments/doctor/:id  — All appointments for a doctor
router.get("/doctor/:id", getDoctorAppointments);

// GET    /api/appointments/:id      — Single appointment by ID
router.get("/:id", getAppointmentById);

// PUT    /api/appointments/:id/status — Update appointment status
router.put("/:id/status", updateAppointmentStatus);

// DELETE /api/appointments/:id      — Cancel/delete appointment
router.delete("/:id", deleteAppointment);

module.exports = router;
