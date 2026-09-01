const courseService = require('../services/courseService');
const response = require('../utils/response');

const getCourses = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;
    const courses = await courseService.getCourses({ search, category, level });
    return response.success(res, courses, 'Courses retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);
    return response.success(res, course, 'Course details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getLessonDetails = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await courseService.getLessonDetails(lessonId);
    return response.success(res, lesson, 'Lesson details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse({
      ...req.body,
      trainer_id: req.user.id,
    });
    return response.success(res, course, 'Course created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const { completed } = req.body;
    const progress = await courseService.updateLessonProgress(req.user.id, courseId, lessonId, completed);
    return response.success(res, progress, 'Progress updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getLessonDetails,
  createCourse,
  updateProgress,
};
