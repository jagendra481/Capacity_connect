import api from './api';

export const adminService = {
  // Executive Overview & Analytics
  getOverview: async () => {
    return api.get('/admin/overview');
  },

  getAnalytics: async (timeframe = '30d') => {
    return api.get('/admin/analytics', { params: { timeframe } });
  },

  // User Management
  getUsers: async (params = {}) => {
    return api.get('/admin/users', { params });
  },

  getUserDetails: async (id) => {
    return api.get(`/admin/users/${id}`);
  },

  createUser: async (data) => {
    return api.post('/admin/users', data);
  },

  updateUserStatus: async (id, status, reason = '') => {
    return api.put(`/admin/users/${id}/status`, { status, reason });
  },

  updateUserRole: async (id, role) => {
    return api.put(`/admin/users/${id}/role`, { role });
  },

  resetUserPassword: async (id, password) => {
    return api.post(`/admin/users/${id}/reset-password`, { password });
  },

  resetUserProgress: async (id) => {
    return api.post(`/admin/users/${id}/reset-progress`);
  },

  // Admin Account Creation (super_admin / verified admin only)
  getAdmins: async () => {
    return api.get('/admin/admins');
  },

  createAdmin: async (data) => {
    return api.post('/admin/admins', data);
  },

  // Course Management
  getCourses: async () => {
    return api.get('/admin/courses');
  },

  createCourse: async (data) => {
    return api.post('/admin/courses', data);
  },

  updateCourse: async (id, data) => {
    return api.put(`/admin/courses/${id}`, data);
  },

  deleteCourse: async (id) => {
    return api.delete(`/admin/courses/${id}`);
  },

  assignTrainer: async (courseId, trainerId) => {
    return api.post(`/admin/courses/${courseId}/assign-trainer`, { trainer_id: trainerId });
  },

  getCourseEnrollments: async (courseId) => {
    return api.get(`/admin/courses/${courseId}/enrollments`);
  },

  enrollTrainee: async (courseId, userId) => {
    return api.post(`/admin/courses/${courseId}/enroll`, { user_id: userId });
  },

  // Assessment & MCQ Management
  getAssessments: async () => {
    return api.get('/admin/assessments');
  },

  createAssessment: async (data) => {
    return api.post('/admin/assessments', data);
  },

  updateAssessment: async (id, data) => {
    return api.put(`/admin/assessments/${id}`, data);
  },

  deleteAssessment: async (id) => {
    return api.delete(`/admin/assessments/${id}`);
  },

  getAssessmentQuestions: async (assessmentId) => {
    return api.get(`/admin/assessments/${assessmentId}/questions`);
  },

  addQuestion: async (assessmentId, data) => {
    return api.post(`/admin/assessments/${assessmentId}/questions`, data);
  },

  getAssessmentAttempts: async (assessmentId) => {
    return api.get(`/admin/assessments/${assessmentId}/attempts`);
  },

  // Learning Resource Library
  getResources: async (params = {}) => {
    return api.get('/admin/resources', { params });
  },

  createResource: async (data) => {
    return api.post('/admin/resources', data);
  },

  updateResource: async (id, data) => {
    return api.put(`/admin/resources/${id}`, data);
  },

  deleteResource: async (id) => {
    return api.delete(`/admin/resources/${id}`);
  },

  // Competencies & Trainer Matching
  getCompetencies: async () => {
    return api.get('/admin/competencies');
  },

  matchTrainers: async (courseId) => {
    return api.get('/admin/competencies/match-trainers', { params: { course_id: courseId } });
  },

  // Announcements & Notifications
  getAnnouncements: async () => {
    return api.get('/admin/announcements');
  },

  createAnnouncement: async (data) => {
    return api.post('/admin/announcements', data);
  },

  updateAnnouncement: async (id, data) => {
    return api.put(`/admin/announcements/${id}`, data);
  },

  deleteAnnouncement: async (id) => {
    return api.delete(`/admin/announcements/${id}`);
  },

  // Audit Logs & System Activity
  getAuditLogs: async (params = {}) => {
    return api.get('/admin/activity-logs', { params });
  },

  // Departments
  getDepartments: async () => {
    return api.get('/admin/departments');
  },

  createDepartment: async (data) => {
    return api.post('/admin/departments', data);
  },

  // Capacity Reports & Export
  exportCapacityReport: async (type = 'full') => {
    return api.get('/admin/reports/export', { params: { type } });
  },
};

export default adminService;
