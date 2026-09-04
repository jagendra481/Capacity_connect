import api from './api';

export const certificateService = {
  getUserCertificates: async () => {
    return api.get('/certificates/user');
  },

  getAllCertificatesAdmin: async () => {
    return api.get('/certificates/admin/all');
  },

  updateCertificateStatusAdmin: async (id, status) => {
    return api.put(`/certificates/admin/${id}/status`, { status });
  },

  verifyCertificate: async (hash) => {
    return api.get(`/certificates/verify/${hash}`);
  },

  generateCertificate: async (data) => {
    return api.post('/certificates/generate', data);
  },
};

export default certificateService;
