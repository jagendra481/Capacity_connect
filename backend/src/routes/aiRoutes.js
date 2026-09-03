const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const jwt = require('../utils/jwt');

// Optional auth helper: decodes Bearer token if present to attach user context
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    } catch (e) {
      // Proceed as guest if token expired
    }
  }
  next();
};

router.post('/chat', optionalAuth, aiController.chat);
router.get('/practice-questions', optionalAuth, aiController.getPracticeQuestions);
router.get('/flashcards', optionalAuth, aiController.getFlashcards);

module.exports = router;
