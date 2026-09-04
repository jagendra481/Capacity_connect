import api from './api';

export const certificateService = {
  // Trainee API
  getUserCertificates: async () => {
    return api.get('/certificates/user');
  },

  claimCertificate: async (data) => {
    return api.post('/certificates/claim', data);
  },

  checkEligibility: async (courseId) => {
    return api.get(`/certificates/eligibility/${courseId}`);
  },

  // Public Verification API (No auth required)
  verifyCertificate: async (identifier) => {
    return api.get(`/certificates/verify/${identifier}`);
  },

  // Admin Governance API
  getAllCertificatesAdmin: async () => {
    return api.get('/certificates/admin/all');
  },

  approveCertificateAdmin: async (id, reason) => {
    return api.put(`/certificates/admin/${id}/approve`, { reason });
  },

  rejectCertificateAdmin: async (id, reason) => {
    return api.put(`/certificates/admin/${id}/reject`, { reason });
  },

  revokeCertificateAdmin: async (id, reason) => {
    return api.put(`/certificates/admin/${id}/revoke`, { reason });
  },

  getCertificateAuditTrailAdmin: async (id) => {
    return api.get(`/certificates/admin/${id}/audit-trail`);
  },
};

export default certificateService;
