const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate } = require('../middleware/authMiddleware');

// Public verification route
router.get('/verify/:hash', certificateController.verifyCertificate);

// Protected routes
router.get('/user', authenticate, certificateController.getMyCertificates);
router.post('/generate', authenticate, certificateController.generateCertificate);

module.exports = router;
