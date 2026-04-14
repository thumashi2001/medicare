const DoctorProfile = require("../models/DoctorProfile");

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

module.exports = {
    getHealth,
    createDoctorProfile,
    getDoctorProfileByUserId,
    updateDoctorProfileByUserId
};