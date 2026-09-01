import api from './api';

export const competencyService = {
  getCompetencyMatrix: async () => {
    return api.get('/competency/matrix');
  },
};

export default competencyService;
