const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/trainees', authenticate, requireRole(['trainer', 'administrator']), trainerController.getTrainerTrainees);
router.get('/courses', authenticate, requireRole(['trainer', 'administrator']), trainerController.getTrainerCourses);
router.post('/courses', authenticate, requireRole(['trainer', 'administrator']), trainerController.createCourse);
router.post('/assessments', authenticate, requireRole(['trainer', 'administrator']), trainerController.createAssessment);

module.exports = router;
