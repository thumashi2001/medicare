const express = require("express");
const router = express.Router();

const { createProfile, getProfile } = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

//Only patient allowed
router.post("/profile", protect, authorize("patient"), createProfile);
router.get("/profile", protect, authorize("patient"), getProfile);

module.exports = router;