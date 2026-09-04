const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/overview', authenticate, requireRole(['administrator']), adminController.getOverviewStats);
router.get('/users', authenticate, requireRole(['administrator']), adminController.getAllUsers);
router.put('/users/:id/role', authenticate, requireRole(['administrator']), adminController.updateUserRole);
router.post('/users/:id/reset-progress', authenticate, requireRole(['administrator']), adminController.resetUserProgress);
router.get('/departments', authenticate, requireRole(['administrator']), adminController.getAllDepartments);
router.post('/departments', authenticate, requireRole(['administrator']), adminController.createDepartment);
router.get('/analytics', authenticate, requireRole(['administrator']), adminController.getAnalyticsData);
router.get('/reports/export', authenticate, requireRole(['administrator']), adminController.exportCapacityReport);

module.exports = router;
