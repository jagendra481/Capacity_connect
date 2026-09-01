const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/gap', authenticate, skillController.getMySkillGap);
router.get('/', authenticate, skillController.getAllSkills);

module.exports = router;
