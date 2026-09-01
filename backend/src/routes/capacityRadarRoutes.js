const express = require('express');
const router = express.Router();
const capacityRadarController = require('../controllers/capacityRadarController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/organizational', authenticate, capacityRadarController.getOrganizationalRadar);
router.get('/department/:id', authenticate, capacityRadarController.getDepartmentRadar);
router.post('/roi-calculator', authenticate, capacityRadarController.calculateImpact);

module.exports = router;
