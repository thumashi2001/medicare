const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User Registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete users
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        await User.findByIdAndDelete(userId);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//verify doctors
exports.verifyDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;

        const doctor = await User.findById(doctorId);

        if (!doctor || doctor.role !== "doctor") {
            return res.status(404).json({ message: "Doctor not found" });
        }

        doctor.isVerified = true;
        await doctor.save();

        res.json({ message: "Doctor verified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isVerified: false
    }).select("-password");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVerifiedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isVerified: true
    }).select("-password");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.rejected = true;
    doctor.isVerified = false;
    await doctor.save();

    res.json({ message: "Doctor rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};