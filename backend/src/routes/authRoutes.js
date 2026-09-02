const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmailOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.me);

module.exports = router;
