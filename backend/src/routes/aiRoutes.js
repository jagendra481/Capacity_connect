const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/chat', authenticate, aiController.chat);
router.get('/practice-questions', authenticate, aiController.getPracticeQuestions);
router.get('/flashcards', authenticate, aiController.getFlashcards);

module.exports = router;
