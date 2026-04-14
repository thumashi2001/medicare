const DoctorProfile = require("../models/DoctorProfile");
const Availability = require("../models/Availability");

const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Doctor service is running"
    });
};

const createDoctorProfile = async (req, res) => {
    try {
        const {
            userId,
            specialization,
            hospital,
            experience,
            qualifications,
            consultationFee,
            bio,
            profileImage
        } = req.body;

        if (!userId || !specialization) {
            return res.status(400).json({
                success: false,
                message: "userId and specialization are required"
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

const getDoctorProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

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

const updateDoctorProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

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
        const { userId, dayOfWeek, startTime, endTime, mode, isAvailable } = req.body;

        if (!userId || !dayOfWeek || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "userId, dayOfWeek, startTime and endTime are required"
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

const getAvailabilityByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

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

        const updatedAvailability = await Availability.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedAvailability) {
            return res.status(404).json({
                success: false,
                message: "Availability slot not found"
            });
        }

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

        const deletedAvailability = await Availability.findByIdAndDelete(id);

        if (!deletedAvailability) {
            return res.status(404).json({
                success: false,
                message: "Availability slot not found"
            });
        }

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

module.exports = {
    getHealth,
    createDoctorProfile,
    getDoctorProfileByUserId,
    updateDoctorProfileByUserId,
    createAvailability,
    getAvailabilityByUserId,
    updateAvailabilityById,
    deleteAvailabilityById
};