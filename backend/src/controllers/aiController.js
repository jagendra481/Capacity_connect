const aiService = require('../services/aiService');
const response = require('../utils/response');

const chat = async (req, res, next) => {
  try {
    const { prompt, courseId, mode } = req.body;
    if (!prompt) {
      return response.error(res, 'Prompt message is required', 400);
    }
    const data = await aiService.chat({ prompt, courseId, mode });
    return response.success(res, data, 'AI response generated successfully', 200);
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
