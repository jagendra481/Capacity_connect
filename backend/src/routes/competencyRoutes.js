const express = require('express');
const router = express.Router();
const competencyController = require('../controllers/competencyController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/matrix', authenticate, competencyController.getCompetencyMatrix);

module.exports = router;
