import api from './api';

export const recommendationService = {
  getRecommendations: async () => {
    return api.get('/recommendations');
  },

  getLearningPaths: async () => {
    return api.get('/recommendations/paths');
  },
};

export default recommendationService;
