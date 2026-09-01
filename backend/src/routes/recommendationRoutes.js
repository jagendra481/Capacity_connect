const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, recommendationController.getMyRecommendations);
router.get('/paths', authenticate, recommendationController.getLearningPaths);

module.exports = router;
