const aiService = require('../services/aiService');
const response = require('../utils/response');

/**
 * AI Chat Endpoint (POST /api/ai/chat)
 */
const chat = async (req, res, next) => {
  try {
    const { prompt, message, courseId, moduleId, lessonId, mode, conversationId, history } = req.body;
    const query = prompt || message;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return response.error(res, 'Prompt or message string is required', 400);
    }

    const data = await aiService.chat({
      prompt: query.trim(),
      message: query.trim(),
      courseId: courseId || null,
      moduleId: moduleId || null,
      lessonId: lessonId || null,
      mode: mode || 'general',
      conversationId: conversationId || null,
      history: Array.isArray(history) ? history : [],
      user: req.user || null,
    });

    return response.success(res, data, 'AI response generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Practice Questions Endpoint (GET /api/ai/practice-questions)
 */
const getPracticeQuestions = async (req, res, next) => {
  try {
    const { topic } = req.query;
    const data = await aiService.generatePracticeQuestions(topic);
    return response.success(res, data, 'Practice questions generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Flashcards Endpoint (GET /api/ai/flashcards)
 */
const getFlashcards = async (req, res, next) => {
  try {
    const { topic } = req.query;
    const data = await aiService.generateFlashcards(topic);
    return response.success(res, data, 'Flashcards generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getPracticeQuestions,
  getFlashcards,
};
