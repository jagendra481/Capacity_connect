import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('capacity_connect_token', res.data.token);
      localStorage.setItem('capacity_connect_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('capacity_connect_token', res.data.token);
      localStorage.setItem('capacity_connect_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  googleAuth: async (googleData) => {
    const res = await api.post('/auth/google', googleData);
    if (res.data?.token) {
      localStorage.setItem('capacity_connect_token', res.data.token);
      localStorage.setItem('capacity_connect_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  getCurrentUser: async () => {
    return api.get('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('capacity_connect_token');
    localStorage.removeItem('capacity_connect_user');
  },

  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },
};

export default authService;
