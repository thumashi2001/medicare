const DoctorProfile = require("../models/DoctorProfile");
const Availability = require("../models/Availability");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Doctor service is running"
    });
};

// Public — list all doctors for the patient booking page
const getAllDoctors = async (req, res) => {
    try {
        const profiles = await DoctorProfile.find({});
        const doctors = profiles.map((p) => ({
            _id: p.userId,           // auth-service user ID — used as doctorId when booking
            profileId: p._id,
            name: p.name || "Dr. (name not set)",
            specialty: p.specialization,
            hospital: p.hospital,
            experience: `${p.experience} years`,
            fee: p.consultationFee,
            bio: p.bio,
            profileImage: p.profileImage,
            rating: 4.5,             // placeholder until ratings are implemented
        }));
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch doctors", error: error.message });
    }
};

const createDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            specialization,
            hospital,
            experience,
            qualifications,
            consultationFee,
            bio,
            profileImage
        } = req.body;

        if (!specialization) {
            return res.status(400).json({
                success: false,
                message: "specialization is required"
            });
        }

        const existingProfile = await DoctorProfile.findOne({ userId });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Doctor profile already exists for this user"
            });
        }

        const doctorProfile = await DoctorProfile.create({
            userId,
            name,
            specialization,
            hospital,
            experience,
            qualifications,
            consultationFee,
            bio,
            profileImage
        });

        res.status(201).json({
            success: true,
            message: "Doctor profile created successfully",
            data: doctorProfile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create doctor profile",
            error: error.message
        });
    }
};

const getMyDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const doctorProfile = await DoctorProfile.findOne({ userId });

        if (!doctorProfile) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: doctorProfile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch doctor profile",
            error: error.message
        });
    }
};

const updateMyDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const updatedProfile = await DoctorProfile.findOneAndUpdate(
            { userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            data: updatedProfile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update doctor profile",
            error: error.message
        });
    }
};

const createAvailability = async (req, res) => {
    try {
        const userId = req.user.id;
        const { dayOfWeek, startTime, endTime, mode, isAvailable } = req.body;

        if (!dayOfWeek || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "dayOfWeek, startTime and endTime are required"
            });
        }

        // Convert "HH:MM" to minutes for comparison
        const toMins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
        const newStart = toMins(startTime);
        const newEnd   = toMins(endTime);

        if (newEnd <= newStart) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }

        // Check for overlap with existing slots on the same day
        const existing = await Availability.find({ userId, dayOfWeek });
        const overlapping = existing.find((s) => {
            const exStart = toMins(s.startTime);
            const exEnd   = toMins(s.endTime);
            return newStart < exEnd && newEnd > exStart;
        });

        if (overlapping) {
            return res.status(409).json({
                success: false,
                message: `This slot overlaps with an existing slot on ${dayOfWeek} (${overlapping.startTime} – ${overlapping.endTime})`
            });
        }

        const availability = await Availability.create({
            userId,
            dayOfWeek,
            startTime,
            endTime,
            mode,
            isAvailable
        });

        res.status(201).json({
            success: true,
            message: "Availability slot created successfully",
            data: availability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create availability slot",
            error: error.message
        });
    }
};

const getMyAvailability = async (req, res) => {
    try {
        const userId = req.user.id;

        const availabilitySlots = await Availability.find({ userId }).sort({
            dayOfWeek: 1,
            startTime: 1
        });

        res.status(200).json({
            success: true,
            count: availabilitySlots.length,
            data: availabilitySlots
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch availability slots",
            error: error.message
        });
    }
};

const updateAvailabilityById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const availability = await Availability.findById(id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Availability slot not found"
            });
        }

        if (availability.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own availability slots"
            });
        }

        const updatedAvailability = await Availability.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Availability slot updated successfully",
            data: updatedAvailability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update availability slot",
            error: error.message
        });
    }
};

const deleteAvailabilityById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const availability = await Availability.findById(id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Availability slot not found"
            });
        }

        if (availability.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own availability slots"
            });
        }

        await Availability.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Availability slot deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete availability slot",
            error: error.message
        });
    }
};

const createPrescription = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { patientId, appointmentId, diagnosis, medicines, notes } = req.body;

        if (!patientId || !diagnosis || !medicines || medicines.length === 0) {
            return res.status(400).json({
                success: false,
                message: "patientId, diagnosis and medicines are required"
            });
        }

        const prescription = await Prescription.create({
            doctorId,
            patientId,
            appointmentId,
            diagnosis,
            medicines,
            notes
        });

        res.status(201).json({
            success: true,
            message: "Prescription created successfully",
            data: prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create prescription",
            error: error.message
        });
    }
};

const getMyPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const prescriptions = await Prescription.find({ doctorId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prescriptions",
            error: error.message
        });
    }
};

const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;

        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found"
            });
        }

        if (prescription.doctorId !== doctorId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prescription",
            error: error.message
        });
    }
};

const getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.user.id;

        const prescriptions = await Prescription.find({
            doctorId,
            patientId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient prescriptions",
            error: error.message
        });
    }
};

const createAppointment = async (req, res) => {
    try {
        const { patientId, date, time } = req.body;
        const doctorId = req.user.id;

        const appointment = await Appointment.create({
            doctorId,
            patientId,
            date,
            time
        });

        res.status(201).json({
            success: true,
            message: "Appointment created",
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create appointment",
            error: error.message
        });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const appointments = await Appointment.find({ doctorId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments",
            error: error.message
        });
    }
};

const acceptAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.doctorId !== doctorId) {
            return res.status(403).json({ success: false, message: "Not your appointment" });
        }

        appointment.status = "accepted";
        await appointment.save();

        res.json({
            success: true,
            message: "Appointment accepted",
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to accept appointment",
            error: error.message
        });
    }
};

const rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.doctorId !== doctorId) {
            return res.status(403).json({ success: false, message: "Not your appointment" });
        }

        appointment.status = "rejected";
        await appointment.save();

        res.json({
            success: true,
            message: "Appointment rejected",
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reject appointment",
            error: error.message
        });
    }
};

// Public — get availability slots for a specific doctor (used by patient booking)
const getDoctorAvailability = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const slots = await Availability.find({ userId: doctorId, isAvailable: true }).sort({
            dayOfWeek: 1,
            startTime: 1,
        });
        res.status(200).json({ success: true, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch availability", error: error.message });
    }
};

module.exports = {
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
};