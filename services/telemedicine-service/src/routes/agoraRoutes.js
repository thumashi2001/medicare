const express = require('express');
const router = express.Router();
const { getAgoraToken } = require('../controllers/agoraController');

// This will be accessible at /api/agora/get-token
router.get('/get-token', getAgoraToken);

module.exports = router;