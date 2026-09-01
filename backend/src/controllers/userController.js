const userService = require('../services/userService');
const Department = require('../models/Department');
const response = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const data = await userService.getUserProfile(req.user.id);
    return response.success(res, data, 'User profile retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await userService.updateUserProfile(req.user.id, req.body);
    return response.success(res, data, 'User profile updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const data = await userService.getAllUsers();
    return response.success(res, data, 'All users retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const data = await Department.getAll();
    return response.success(res, data, 'Departments retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getTraineeDashboard = async (req, res, next) => {
  try {
    const data = await userService.getTraineeDashboardData(req.user.id);
    return response.success(res, data, 'Trainee dashboard data retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getDepartments,
  getTraineeDashboard,
};
