import api from './api';

export const adminService = {
  getOverview: async () => {
    return api.get('/admin/overview');
  },

  getUsers: async () => {
    return api.get('/admin/users');
  },

  updateUserRole: async (id, role) => {
    return api.put(`/admin/users/${id}/role`, { role });
  },

  getDepartments: async () => {
    return api.get('/admin/departments');
  },

  createDepartment: async (data) => {
    return api.post('/admin/departments', data);
  },

  getAnalytics: async () => {
    return api.get('/admin/analytics');
  },

  exportCapacityReport: async () => {
    return api.get('/admin/reports/export');
  },
};

export default adminService;
