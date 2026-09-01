const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/posts', authenticate, knowledgeController.getPosts);
router.get('/posts/:id', authenticate, knowledgeController.getPostById);
router.post('/posts', authenticate, knowledgeController.createPost);
router.post('/posts/:id/comments', authenticate, knowledgeController.addComment);
router.post('/posts/:id/like', authenticate, knowledgeController.toggleLike);

module.exports = router;
