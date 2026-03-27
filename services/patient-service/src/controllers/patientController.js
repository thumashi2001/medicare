const Patient = require("../models/Patient");

//Create profile
exports.createProfile = async (req, res) => {
    try {
        const existing = await Patient.findOne({ userId: req.user.id });

        if(existing) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        const patient = await Patient.create({
            userId: req.user.id,
            ...req.body
        });

        res.status(201).json(patient);
    } catch (error) {
        console.error("CREATE PROFILE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

//Get Profile
exports.getProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(patient);
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

//Upload Report
exports.uploadReport = async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        patient.reports.push({
            filePath: req.file.path
        });

        await patient.save();
        
        res.json({ message: "Report uploaded successfully", file: req.file.path });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

//Get Reports
exports.getReports = async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.id });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient.reports);
    } catch (error) {
        console.error("GET REPORTS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};