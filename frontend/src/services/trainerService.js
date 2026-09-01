import api from './api';

export const trainerService = {
  getTrainees: async () => {
    return api.get('/trainer/trainees');
  },

  getCourses: async () => {
    return api.get('/trainer/courses');
  },

  createCourse: async (data) => {
    return api.post('/trainer/courses', data);
  },

  createAssessment: async (data) => {
    return api.post('/trainer/assessments', data);
  },
};

export default trainerService;
