const trainerService = require('../services/trainerService');
const response = require('../utils/response');

const getTrainerTrainees = async (req, res, next) => {
  try {
    const data = await trainerService.getTrainerTrainees(req.user.id);
    return response.success(res, data, 'Assigned trainees retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getTrainerCourses = async (req, res, next) => {
  try {
    const data = await trainerService.getTrainerCourses(req.user.id);
    return response.success(res, data, 'Trainer courses retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const data = await trainerService.createCourse(req.body);
    return response.success(res, data, 'Course created by trainer', 201);
  } catch (error) {
    next(error);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    const data = await trainerService.createAssessment(req.body);
    return response.success(res, data, 'Assessment created by trainer', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrainerTrainees,
  getTrainerCourses,
  createCourse,
  createAssessment,
};
