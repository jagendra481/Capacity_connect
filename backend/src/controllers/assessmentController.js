const assessmentService = require('../services/assessmentService');
const response = require('../utils/response');

const getAllAssessments = async (req, res, next) => {
  try {
    const data = await assessmentService.getAllAssessments();
    return response.success(res, data, 'Assessments retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await assessmentService.getAssessmentById(id);
    return response.success(res, data, 'Assessment details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    const data = await assessmentService.createAssessment(req.body);
    return response.success(res, data, 'Assessment created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const addQuestion = async (req, res, next) => {
  try {
    const data = await assessmentService.addQuestion(req.body);
    return response.success(res, data, 'Question added successfully', 201);
  } catch (error) {
    next(error);
  }
};

const submitAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const data = await assessmentService.submitAssessment(req.user.id, id, answers);
    return response.success(res, data, 'Assessment evaluation completed', 200);
  } catch (error) {
    next(error);
  }
};

const getUserHistory = async (req, res, next) => {
  try {
    const data = await assessmentService.getUserHistory(req.user.id);
    return response.success(res, data, 'Assessment history retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  addQuestion,
  submitAssessment,
  getUserHistory,
};
