const express = require('express');
const router = express.Router();
const { handleAgentStatusRequest } = require('../controllers/adminOps');
const verifyToken = require('../functions/verifyToken.middleware');
const uploadImages = require('../functions/fileupload.middleware');

router.post('/agentStatusRequest', verifyToken, uploadImages, handleAgentStatusRequest);

module.exports = router;
