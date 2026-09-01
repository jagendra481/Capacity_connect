const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.get('/lessons/:lessonId', authenticate, courseController.getLessonDetails);
router.post('/', authenticate, requireRole(['trainer', 'administrator']), courseController.createCourse);
router.post('/:courseId/lessons/:lessonId/progress', authenticate, courseController.updateProgress);

module.exports = router;
