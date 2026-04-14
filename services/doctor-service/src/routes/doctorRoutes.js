const express = require("express");
const router = express.Router();
const { getHealth } = require("../controllers/doctorController");

router.get("/health", getHealth);

module.exports = router;