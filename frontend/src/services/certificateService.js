import api from './api';

export const certificateService = {
  getUserCertificates: async () => {
    return api.get('/certificates/user');
  },

  verifyCertificate: async (hash) => {
    return api.get(`/certificates/verify/${hash}`);
  },

  generateCertificate: async (data) => {
    return api.post('/certificates/generate', data);
  },
};

export default certificateService;
