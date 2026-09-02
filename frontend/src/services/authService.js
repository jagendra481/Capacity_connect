import api from './api';

export const authService = {
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },

  register: async (userData) => {
    return api.post('/auth/signup', userData);
  },

  verifyEmailOTP: async (email, otp) => {
    const res = await api.post('/auth/verify-email', { email, otp });
    if (res.data?.token) {
      localStorage.setItem('capacity_connect_token', res.data.token);
      localStorage.setItem('capacity_connect_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  resendOTP: async (email) => {
    return api.post('/auth/resend-otp', { email });
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('capacity_connect_token', res.data.token);
      localStorage.setItem('capacity_connect_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  sendOTP: async (email) => {
    return api.post('/auth/send-otp', { email });
  },

  verifyOTP: async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
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

  resetPassword: async (email, otp, newPassword) => {
    return api.post('/auth/reset-password', { email, otp, newPassword });
  },
};

export default authService;
