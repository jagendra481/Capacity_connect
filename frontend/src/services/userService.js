import api from './api';

export const userService = {
  getProfile: async () => {
    return api.get('/users/profile');
  },

  updateProfile: async (data) => {
    return api.put('/users/profile', data);
  },

  getDepartments: async () => {
    return api.get('/users/departments');
  },

  getTraineeDashboard: async () => {
    return api.get('/users/trainee-dashboard');
  },

  getAllUsers: async () => {
    return api.get('/users');
  },
};

export default userService;
