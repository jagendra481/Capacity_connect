import api from './api';

export const gamificationService = {
  getUserGamification: async () => {
    return api.get('/gamification/user');
  },

  getLeaderboard: async () => {
    return api.get('/gamification/leaderboard');
  },
};

export default gamificationService;
