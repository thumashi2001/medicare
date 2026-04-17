const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

// @desc  Create a new appointment & trigger pending-payment notification
// @route POST /api/appointments
const createAppointment = async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            doctorName,
            doctorSpecialty,
            appointmentDate,
            appointmentTime,
        } = req.body;

        if (
            !patientId ||
            !doctorId ||
            !doctorName ||
            !doctorSpecialty ||
            !appointmentDate ||
            !appointmentTime
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            doctorName,
            doctorSpecialty,
            appointmentDate,
            appointmentTime,
            status: "Pending",
        });

        // Auto-generate notification for the patient
        await Notification.create({
            userId: patientId,
            title: "Appointment Created (Pending Payment)",
            message: `Your appointment with ${doctorName} (${doctorSpecialty}) on ${formatDate(appointmentDate)} at ${appointmentTime} has been created and is awaiting payment confirmation.`,
        });

        return res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        console.error("createAppointment error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc  Get all appointments for a specific patient
// @route GET /api/appointments/patient/:id
const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patientId: req.params.id,
        }).sort({ appointmentDate: -1 });

        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error("getPatientAppointments error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc  Get a single appointment by ID
// @route GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res
                .status(404)
                .json({ success: false, message: "Appointment not found" });
        }

        return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error("getAppointmentById error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc  Update appointment status; triggers notification on Confirmed or Cancelled
// @route PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Confirmed", "Cancelled"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res
                .status(404)
                .json({ success: false, message: "Appointment not found" });
        }

        if (status === "Confirmed") {
            await Notification.create({
                userId: appointment.patientId,
                title: "Appointment Confirmed",
                message: `Great news! Your appointment with ${appointment.doctorName} (${appointment.doctorSpecialty}) on ${formatDate(appointment.appointmentDate)} at ${appointment.appointmentTime} has been confirmed.`,
            });
        }

        if (status === "Cancelled") {
            await Notification.create({
                userId: appointment.patientId,
                title: "Appointment Cancelled",
                message: `Your appointment with ${appointment.doctorName} (${appointment.doctorSpecialty}) on ${formatDate(appointment.appointmentDate)} at ${appointment.appointmentTime} has been cancelled.`,
            });
        }

        return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error("updateAppointmentStatus error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc  Cancel/Delete an appointment and notify the patient
// @route DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res
                .status(404)
                .json({ success: false, message: "Appointment not found" });
        }

        await Notification.create({
            userId: appointment.patientId,
            title: "Appointment Cancelled",
            message: `Your appointment with ${appointment.doctorName} (${appointment.doctorSpecialty}) on ${formatDate(appointment.appointmentDate)} at ${appointment.appointmentTime} has been cancelled.`,
        });

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
        });
    } catch (error) {
        console.error("deleteAppointment error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc  Get all appointments for a specific doctor
// @route GET /api/appointments/doctor/:id
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctorId: req.params.id,
        }).sort({ appointmentDate: -1 });

        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error("getDoctorAppointments error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    createAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
};
