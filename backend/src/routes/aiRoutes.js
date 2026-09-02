const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Optional auth helper: if token is present, decode it and attach user; if not, proceed as guest
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const jwt = require('../utils/jwt');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    } catch (e) {
      // Proceed as unauthenticated guest if token is invalid
    }
  }
  next();
};

router.post('/chat', optionalAuth, aiController.chat);
router.get('/practice-questions', optionalAuth, aiController.getPracticeQuestions);
router.get('/flashcards', optionalAuth, aiController.getFlashcards);

module.exports = router;
