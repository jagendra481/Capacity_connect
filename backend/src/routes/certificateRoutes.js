const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

// Public Verification routes (No login required)
router.get('/verify', certificateController.verifyCertificate);
router.get('/verify/:identifier', certificateController.verifyCertificate);

// Protected Trainee routes
router.get('/user', authenticate, certificateController.getMyCertificates);
router.post('/claim', authenticate, certificateController.claimCertificate);
router.get('/eligibility/:courseId', authenticate, certificateController.checkEligibility);

// Protected Admin Governance routes
router.get('/admin/all', authenticate, requireRole(['administrator']), certificateController.getAllCertificates);
router.put('/admin/:id/approve', authenticate, requireRole(['administrator']), certificateController.approveCertificate);
router.put('/admin/:id/reject', authenticate, requireRole(['administrator']), certificateController.rejectCertificate);
router.put('/admin/:id/revoke', authenticate, requireRole(['administrator']), certificateController.revokeCertificate);
router.get('/admin/:id/audit-trail', authenticate, requireRole(['administrator']), certificateController.getCertificateAuditTrail);

module.exports = router;
