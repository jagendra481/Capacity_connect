import api from './api';

export const aiService = {
  chat: async (prompt, courseId = null, mode = 'general') => {
    return api.post('/ai/chat', { prompt, courseId, mode });
  },

  getPracticeQuestions: async (topic) => {
    return api.get('/ai/practice-questions', { params: { topic } });
  },

  getFlashcards: async (topic) => {
    return api.get('/ai/flashcards', { params: { topic } });
  },
};

export default aiService;
