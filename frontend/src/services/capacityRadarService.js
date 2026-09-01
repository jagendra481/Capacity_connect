import api from './api';

export const capacityRadarService = {
  getOrganizationalRadar: async () => {
    return api.get('/capacity-radar/organizational');
  },

  getDepartmentRadar: async (id) => {
    return api.get(`/capacity-radar/department/${id}`);
  },

  calculateROI: async (data) => {
    return api.post('/capacity-radar/roi-calculator', data);
  },
};

export default capacityRadarService;
