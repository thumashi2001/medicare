const DoctorProfile = require("../models/DoctorProfile");
const Availability = require("../models/Availability");
const Prescription = require("../models/Prescription");

const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Doctor service is running"
    });
};

const createDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
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

module.exports = {
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
};