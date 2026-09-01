const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', authenticate, assessmentController.getAllAssessments);
router.get('/history', authenticate, assessmentController.getUserHistory);
router.get('/:id', authenticate, assessmentController.getAssessmentById);
router.post('/', authenticate, requireRole(['trainer', 'administrator']), assessmentController.createAssessment);
router.post('/questions', authenticate, requireRole(['trainer', 'administrator']), assessmentController.addQuestion);
router.post('/:id/submit', authenticate, assessmentController.submitAssessment);

module.exports = router;
