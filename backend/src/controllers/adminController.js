const adminService = require('../services/adminService');
const response = require('../utils/response');

const getOverviewStats = async (req, res, next) => {
  try {
    const data = await adminService.getOverviewStats();
    return response.success(res, data, 'Admin overview stats retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers();
    return response.success(res, data, 'All users retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const data = await adminService.updateUserRole(id, role);
    return response.success(res, data, 'User role updated', 200);
  } catch (error) {
    next(error);
  }
};

const getAllDepartments = async (req, res, next) => {
  try {
    const data = await adminService.getAllDepartments();
    return response.success(res, data, 'All departments retrieved', 200);
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

const getAnalyticsData = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsData();
    return response.success(res, data, 'Analytics data retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const exportCapacityReport = async (req, res, next) => {
  try {
    const data = await adminService.generateCapacityReport();
    return response.success(res, data, 'Capacity report generated', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats,
  getAllUsers,
  updateUserRole,
  getAllDepartments,
  createDepartment,
  getAnalyticsData,
  exportCapacityReport,
};
