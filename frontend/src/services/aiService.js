import api from './api';

export const aiService = {
  chat: async (prompt, courseId = null, mode = 'general', extraParams = {}) => {
    return api.post('/ai/chat', {
      prompt,
      message: prompt,
      courseId,
      mode,
      ...extraParams,
    });
  },

  getPracticeQuestions: async (topic = 'Software Engineering') => {
    return api.get('/ai/practice-questions', { params: { topic } });
  },

  getFlashcards: async (topic = 'Capacity Connect Concepts') => {
    return api.get('/ai/flashcards', { params: { topic } });
  },
};

export default aiService;
