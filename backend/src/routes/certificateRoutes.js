const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Public verification route
router.get('/verify/:hash', certificateController.verifyCertificate);

// Protected Trainee routes
router.get('/user', authenticate, certificateController.getMyCertificates);
router.post('/generate', authenticate, certificateController.generateCertificate);

// Protected Admin Governance routes
router.get('/admin/all', authenticate, requireRole(['administrator']), certificateController.getAllCertificates);
router.put('/admin/:id/status', authenticate, requireRole(['administrator']), certificateController.updateCertificateStatus);

module.exports = router;
