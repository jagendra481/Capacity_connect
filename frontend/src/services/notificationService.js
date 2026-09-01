import api from './api';

export const notificationService = {
  getNotifications: async () => {
    return api.get('/notifications');
  },

  markAsRead: async (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return api.put('/notifications/mark-all-read');
  },
};

export default notificationService;
