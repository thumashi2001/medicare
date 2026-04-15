const express = require("express");
const router = express.Router();

const { createProfile, getProfile, uploadReport, getReports } = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../config/upload");
const Patient = require("../models/Patient");

//Only patient allowed
router.post("/profile", protect, authorize("patient"), createProfile);
router.get("/profile", protect, authorize("patient"), getProfile);
router.post("/upload", protect, authorize("patient"), upload.single("report"), uploadReport);
router.get("/reports", protect, authorize("patient"), getReports);
router.get("/prescriptions", protect, authorize("patient"), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient.prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/video-link", protect, authorize("patient"), (req, res) => {
  res.json({
    link: "https://meet.google.com/sample-healthcare-link"
  });
});

module.exports = router;