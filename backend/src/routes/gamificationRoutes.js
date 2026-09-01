const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/user', authenticate, gamificationController.getMyGamification);
router.get('/leaderboard', authenticate, gamificationController.getLeaderboard);

module.exports = router;
