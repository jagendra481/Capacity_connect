import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('capacity_connect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Global Errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      localStorage.removeItem('capacity_connect_token');
      localStorage.removeItem('capacity_connect_user');
    }

    const serverMessage = error.response?.data?.message;
    const serverErrors = error.response?.data?.errors;

    let displayError = '';
    if (Array.isArray(serverErrors) && serverErrors.length > 0) {
      displayError = serverErrors.join(', ');
    } else if (serverMessage) {
      displayError = serverMessage;
    } else {
      displayError = error.message || 'An unexpected error occurred';
    }

    return Promise.reject(displayError);
  }
);

export default api;
