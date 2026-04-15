const Patient = require("../models/Patient");
const fs = require("fs");

// CREATE patient profile
exports.createProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dob, address } = req.body;

    const existingPatient = await Patient.findOne({ userId: req.user.id });

    if (existingPatient) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const patient = await Patient.create({
      userId: req.user.id,
      fullName,
      email,
      phone,
      dob,
      address
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET patient profile
exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE patient profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dob, address } = req.body;

    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    patient.fullName = fullName ?? patient.fullName;
    patient.email = email ?? patient.email;
    patient.phone = phone ?? patient.phone;
    patient.dob = dob ?? patient.dob;
    patient.address = address ?? patient.address;

    await patient.save();

    res.json({
      message: "Profile updated successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPLOAD report
exports.uploadReport = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    patient.reports.push({
      filePath: req.file.path,
      originalName: req.file.originalname
    });

    await patient.save();

    res.json({
      message: "Report uploaded successfully",
      reports: patient.reports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET reports
exports.getReports = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.json(patient.reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete report
exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const report = patient.reports.id(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const filePath = report.filePath;

    patient.reports.pull(reportId);
    await patient.save();

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.json(patient.prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};