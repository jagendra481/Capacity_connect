import api from './api';

export const courseService = {
  getCourses: async (params = {}) => {
    return api.get('/courses', { params });
  },

  getCourseById: async (id) => {
    return api.get(`/courses/${id}`);
  },

  getLessonDetails: async (lessonId) => {
    return api.get(`/courses/lessons/${lessonId}`);
  },

  createCourse: async (data) => {
    return api.post('/courses', data);
  },

  updateLessonProgress: async (courseId, lessonId, completed = true) => {
    return api.post(`/courses/${courseId}/lessons/${lessonId}/progress`, { completed });
  },
};

export default courseService;
