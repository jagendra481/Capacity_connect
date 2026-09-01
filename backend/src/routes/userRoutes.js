const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/departments', userController.getDepartments);
router.get('/trainee-dashboard', authenticate, userController.getTraineeDashboard);
router.get('/', authenticate, requireRole(['administrator', 'trainer']), userController.getAllUsers);

module.exports = router;
