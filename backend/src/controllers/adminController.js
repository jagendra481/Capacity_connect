const adminService = require('../services/adminService');
const response = require('../utils/response');

// Overview & Analytics
const getOverviewStats = async (req, res, next) => {
  try {
    const data = await adminService.getOverviewStats();
    return response.success(res, data, 'Admin overview stats retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getAnalyticsData = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsData();
    return response.success(res, data, 'Analytics data retrieved', 200);
  } catch (error) {
    next(error);
  }
};

// Users
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, department_id, limit, offset } = req.query;
    const data = await adminService.getAllUsers({ search, role, status, department_id, limit, offset });
    return response.success(res, data, 'Users retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.getUserDetails(id);
    return response.success(res, data, 'User details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const data = await adminService.createUser(req.body, req.user);
    return response.success(res, data, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const data = await adminService.updateUserStatus(id, status, reason, req.user);
    return response.success(res, data, `User status updated to ${status}`, 200);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const data = await adminService.updateUserRole(id, role, req.user);
    return response.success(res, data, `User role updated to ${role}`, 200);
  } catch (error) {
    next(error);
  }
};

const resetUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const data = await adminService.resetUserPassword(id, password, req.user);
    return response.success(res, data, data.message, 200);
  } catch (error) {
    next(error);
  }
};

const resetUserProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.resetUserProgress(id, req.user);
    return response.success(res, data, 'User progress reset successfully', 200);
  } catch (error) {
    next(error);
  }
};

// Admin Management
const getAdmins = async (req, res, next) => {
  try {
    const data = await adminService.getAdmins(req.user);
    return response.success(res, data, 'Admins list retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const data = await adminService.createAdmin(req.body, req.user);
    return response.success(res, data, 'Admin account created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Courses
const getAllCourses = async (req, res, next) => {
  try {
    const data = await adminService.getAllCourses(req.query);
    return response.success(res, data, 'Courses retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const data = await adminService.createCourse(req.body, req.user);
    return response.success(res, data, 'Course created', 201);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.updateCourse(id, req.body, req.user);
    return response.success(res, data, 'Course updated', 200);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteCourse(id, req.user);
    return response.success(res, { id }, 'Course deleted', 200);
  } catch (error) {
    next(error);
  }
};

const assignTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trainer_id } = req.body;
    const data = await adminService.assignCourseTrainer(id, trainer_id, req.user);
    return response.success(res, data, 'Trainer assigned to course', 200);
  } catch (error) {
    next(error);
  }
};

const getCourseEnrollments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.getCourseEnrollments(id);
    return response.success(res, data, 'Enrolled trainees retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const enrollTrainee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const data = await adminService.enrollTrainee(id, user_id, req.user);
    return response.success(res, data, 'Trainee enrolled successfully', 200);
  } catch (error) {
    next(error);
  }
};

// Assessments & Questions
const getAllAssessments = async (req, res, next) => {
  try {
    const data = await adminService.getAllAssessments(req.query);
    return response.success(res, data, 'Assessments retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    const data = await adminService.createAssessment(req.body, req.user);
    return response.success(res, data, 'Assessment created', 201);
  } catch (error) {
    next(error);
  }
};

const updateAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.updateAssessment(id, req.body, req.user);
    return response.success(res, data, 'Assessment updated', 200);
  } catch (error) {
    next(error);
  }
};

const deleteAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteAssessment(id, req.user);
    return response.success(res, { id }, 'Assessment deleted', 200);
  } catch (error) {
    next(error);
  }
};

const getAssessmentQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.getAssessmentQuestions(id);
    return response.success(res, data, 'Questions retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const addQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.addQuestion(id, req.body, req.user);
    return response.success(res, data, 'Question added', 201);
  } catch (error) {
    next(error);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const data = await adminService.updateQuestion(questionId, req.body, req.user);
    return response.success(res, data, 'Question updated', 200);
  } catch (error) {
    next(error);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    await adminService.deleteQuestion(questionId, req.user);
    return response.success(res, { id: questionId }, 'Question deleted', 200);
  } catch (error) {
    next(error);
  }
};

const getAssessmentAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.getAssessmentAttempts(id);
    return response.success(res, data, 'Assessment attempts retrieved', 200);
  } catch (error) {
    next(error);
  }
};

// Learning Resources
const getAllResources = async (req, res, next) => {
  try {
    const data = await adminService.getAllResources(req.query);
    return response.success(res, data, 'Resources retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const data = await adminService.createResource(req.body, req.user);
    return response.success(res, data, 'Resource created', 201);
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.updateResource(id, req.body, req.user);
    return response.success(res, data, 'Resource updated', 200);
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteResource(id, req.user);
    return response.success(res, { id }, 'Resource deleted', 200);
  } catch (error) {
    next(error);
  }
};

// Competency Mapping
const getCompetencyMatrix = async (req, res, next) => {
  try {
    const data = await adminService.getCompetencyMatrix();
    return response.success(res, data, 'Competency matrix retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const matchTrainers = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const data = await adminService.matchTrainersForCourse(courseId);
    return response.success(res, data, 'Trainer matches ranked by competency', 200);
  } catch (error) {
    next(error);
  }
};

// Content & Announcements
const getAllAnnouncements = async (req, res, next) => {
  try {
    const data = await adminService.getAllAnnouncements(req.query);
    return response.success(res, data, 'Announcements retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const data = await adminService.createAnnouncement(req.body, req.user);
    return response.success(res, data, 'Announcement created', 201);
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await adminService.updateAnnouncement(id, req.body, req.user);
    return response.success(res, data, 'Announcement updated', 200);
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteAnnouncement(id, req.user);
    return response.success(res, { id }, 'Announcement deleted', 200);
  } catch (error) {
    next(error);
  }
};

// Audit Logs
const getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs(req.query);
    return response.success(res, data, 'Activity audit logs retrieved', 200);
  } catch (error) {
    next(error);
  }
};

// Reports
const exportCapacityReport = async (req, res, next) => {
  try {
    const { reportType } = req.params;
    const data = await adminService.generateCapacityReport(reportType);
    return response.success(res, data, 'Capacity report generated', 200);
  } catch (error) {
    next(error);
  }
};

// Departments
const getAllDepartments = async (req, res, next) => {
  try {
    const data = await adminService.getAllDepartments();
    return response.success(res, data, 'Departments retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const data = await adminService.createDepartment(req.body);
    return response.success(res, data, 'Department created', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats,
  getAnalyticsData,
  getAllUsers,
  getUserDetails,
  createUser,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
  resetUserProgress,
  getAdmins,
  createAdmin,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTrainer,
  getCourseEnrollments,
  enrollTrainee,
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAssessmentAttempts,
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getCompetencyMatrix,
  matchTrainers,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAuditLogs,
  exportCapacityReport,
  getAllDepartments,
  createDepartment,
};
