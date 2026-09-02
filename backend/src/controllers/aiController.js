const aiService = require('../services/aiService');
const response = require('../utils/response');

/**
 * Chat endpoint handling user prompts from both AIAssistant widget and AILearningAssistant page
 */
const chat = async (req, res, next) => {
  try {
    const { prompt, message, courseId, mode, history } = req.body;
    const query = prompt || message;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return response.error(res, 'Prompt or message string is required', 400);
    }

    const data = await aiService.chat({
      prompt: query.trim(),
      message: query.trim(),
      courseId,
      mode: mode || 'general',
      history: history || [],
      user: req.user || null
    });

    return response.success(res, {
      ...data,
      reply: data.answer || data.reply,
      answer: data.answer || data.reply
    }, 'AI response generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getPracticeQuestions = async (req, res, next) => {
  try {
    const { topic } = req.query;
    const data = await aiService.generatePracticeQuestions(topic);
    return response.success(res, data, 'Practice questions generated', 200);
  } catch (error) {
    next(error);
  }
};

const getFlashcards = async (req, res, next) => {
  try {
    const { topic } = req.query;
    const data = await aiService.generateFlashcards(topic);
    return response.success(res, data, 'Flashcards generated', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getPracticeQuestions,
  getFlashcards,
};
