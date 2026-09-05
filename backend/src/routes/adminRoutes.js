const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All routes require authentication & Administrator or Super Admin role
const adminGuard = [authenticate, requireRole(['administrator', 'super_admin'])];

// Overview & Analytics
router.get('/overview', ...adminGuard, adminController.getOverviewStats);
router.get('/analytics', ...adminGuard, adminController.getAnalyticsData);

// User Database Management
router.get('/users', ...adminGuard, adminController.getAllUsers);
router.post('/users', ...adminGuard, adminController.createUser);
router.get('/users/:id', ...adminGuard, adminController.getUserDetails);
router.patch('/users/:id/status', ...adminGuard, adminController.updateUserStatus);
router.put('/users/:id/role', ...adminGuard, adminController.updateUserRole);
router.post('/users/:id/reset-password', ...adminGuard, adminController.resetUserPassword);
router.post('/users/:id/reset-progress', ...adminGuard, adminController.resetUserProgress);

// Admin Management
router.get('/admins', ...adminGuard, adminController.getAdmins);
router.post('/admins', ...adminGuard, adminController.createAdmin);

// Course Management
router.get('/courses', ...adminGuard, adminController.getAllCourses);
router.post('/courses', ...adminGuard, adminController.createCourse);
router.put('/courses/:id', ...adminGuard, adminController.updateCourse);
router.delete('/courses/:id', ...adminGuard, adminController.deleteCourse);
router.post('/courses/:id/assign-trainer', ...adminGuard, adminController.assignTrainer);
router.get('/courses/:id/enrollments', ...adminGuard, adminController.getCourseEnrollments);
router.post('/courses/:id/enroll', ...adminGuard, adminController.enrollTrainee);

// Assessment & Question Management
router.get('/assessments', ...adminGuard, adminController.getAllAssessments);
router.post('/assessments', ...adminGuard, adminController.createAssessment);
router.put('/assessments/:id', ...adminGuard, adminController.updateAssessment);
router.delete('/assessments/:id', ...adminGuard, adminController.deleteAssessment);
router.get('/assessments/:id/questions', ...adminGuard, adminController.getAssessmentQuestions);
router.post('/assessments/:id/questions', ...adminGuard, adminController.addQuestion);
router.put('/assessments/questions/:questionId', ...adminGuard, adminController.updateQuestion);
router.delete('/assessments/questions/:questionId', ...adminGuard, adminController.deleteQuestion);
router.get('/assessments/:id/attempts', ...adminGuard, adminController.getAssessmentAttempts);

// Learning Resource Library
router.get('/resources', ...adminGuard, adminController.getAllResources);
router.post('/resources', ...adminGuard, adminController.createResource);
router.put('/resources/:id', ...adminGuard, adminController.updateResource);
router.delete('/resources/:id', ...adminGuard, adminController.deleteResource);

// Competency Mapping
router.get('/competencies', ...adminGuard, adminController.getCompetencyMatrix);
router.get('/competencies/match-trainers/:courseId', ...adminGuard, adminController.matchTrainers);

// Content & Announcements
router.get('/announcements', ...adminGuard, adminController.getAllAnnouncements);
router.post('/announcements', ...adminGuard, adminController.createAnnouncement);
router.put('/announcements/:id', ...adminGuard, adminController.updateAnnouncement);
router.delete('/announcements/:id', ...adminGuard, adminController.deleteAnnouncement);

// Activity & Audit Logs
router.get('/activity-logs', ...adminGuard, adminController.getAuditLogs);
router.get('/audit-logs', ...adminGuard, adminController.getAuditLogs);

// Reports & Exports
router.get('/reports/export/:reportType', ...adminGuard, adminController.exportCapacityReport);
router.get('/reports/export', ...adminGuard, adminController.exportCapacityReport);

// Departments
router.get('/departments', ...adminGuard, adminController.getAllDepartments);
router.post('/departments', ...adminGuard, adminController.createDepartment);

module.exports = router;
