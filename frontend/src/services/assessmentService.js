import api from './api';

export const assessmentService = {
  getAllAssessments: async () => {
    return api.get('/assessments');
  },

  getAssessmentById: async (id) => {
    return api.get(`/assessments/${id}`);
  },

  submitAssessment: async (id, answers) => {
    return api.post(`/assessments/${id}/submit`, { answers });
  },

  getUserHistory: async () => {
    return api.get('/assessments/history');
  },

  createAssessment: async (data) => {
    return api.post('/assessments', data);
  },

  addQuestion: async (data) => {
    return api.post('/assessments/questions', data);
  },
};

export default assessmentService;
