import api from './api';

export const skillService = {
  getSkillGap: async () => {
    return api.get('/skills/gap');
  },

  getAllSkills: async () => {
    return api.get('/skills');
  },
};

export default skillService;
