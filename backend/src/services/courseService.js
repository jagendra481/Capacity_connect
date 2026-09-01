const Course = require('../models/Course');
const CourseModule = require('../models/CourseModule');
const Lesson = require('../models/Lesson');
const Resource = require('../models/Resource');
const CourseProgress = require('../models/CourseProgress');

class CourseService {
  async getCourses(filters = {}) {
    return Course.getAll(filters);
  }

  async getCourseById(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      const err = new Error('Course not found.');
      err.statusCode = 404;
      throw err;
    }
    const modules = await CourseModule.getByCourseId(courseId);
    return {
      ...course,
      modules,
    };
  }

  async getLessonDetails(lessonId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      const err = new Error('Lesson not found.');
      err.statusCode = 404;
      throw err;
    }
    const resources = await Resource.getByLessonId(lessonId);
    return {
      ...lesson,
      resources,
    };
  }

  async createCourse(courseData) {
    return Course.create(courseData);
  }

  async updateLessonProgress(userId, courseId, lessonId, completed = true) {
    // Record progress state
    return {
      userId,
      courseId,
      lessonId,
      completed,
      updated_at: new Date().toISOString(),
    };
  }
}

module.exports = new CourseService();
