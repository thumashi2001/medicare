const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile,
  uploadReport,
  getReports,
  getPrescriptions,
  deleteReport,
  updateProfilePhoto
} = require("../controllers/patientController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../config/upload");

// Only patient allowed
router.post("/profile", protect, authorize("patient"), createProfile);
router.get("/profile", protect, authorize("patient"), getProfile);
router.put("/profile", protect, authorize("patient"), updateProfile);
router.put("/profile/photo", protect, authorize("patient"), upload.single("photo"), updateProfilePhoto);
router.post("/upload", protect, authorize("patient"), upload.single("report"), uploadReport);
router.get("/reports", protect, authorize("patient"), getReports);
router.delete("/reports/:reportId", protect, authorize("patient"), deleteReport);
router.get("/prescriptions", protect, authorize("patient"), getPrescriptions);
module.exports = router;