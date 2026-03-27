const express = require("express");
const router = express.Router();

const { createProfile, getProfile, uploadReport, getReports } = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../config/upload");

//Only patient allowed
router.post("/profile", protect, authorize("patient"), createProfile);
router.get("/profile", protect, authorize("patient"), getProfile);
router.post("/upload", protect, authorize("patient"), upload.single("report"), uploadReport);
router.get("/reports", protect, authorize("patient"), getReports);

module.exports = router;