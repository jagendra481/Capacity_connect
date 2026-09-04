const Course = require('../models/Course');
const CourseModule = require('../models/CourseModule');
const Lesson = require('../models/Lesson');
const Resource = require('../models/Resource');
const CourseProgress = require('../models/CourseProgress');

class CourseService {
  async getCourses(filters = {}) {
    const { userId, ...courseFilters } = filters;
    const courses = await Course.getAll(courseFilters);
    if (!userId) return courses;

    return Promise.all(courses.map(async course => ({
      ...course,
      ...await this.getCourseProgressSummary(userId, course.id),
    })));
  }

  async getCourseById(courseId, userId) {
    const course = await Course.findById(courseId);
    if (!course) {
      const err = new Error('Course not found.');
      err.statusCode = 404;
      throw err;
    }
    const modules = await CourseModule.getByCourseId(courseId);
    const summary = userId ? await this.getCourseProgressSummary(userId, courseId, modules) : {};
    const completedLessonIds = new Set(summary.completedLessonIds || []);
    return {
      ...course,
      ...summary,
      modules: modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => ({ ...lesson, completed: completedLessonIds.has(lesson.id) })),
      })),
    };
  }

  async getLessonDetails(lessonId, userId, courseId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      const err = new Error('Lesson not found.');
      err.statusCode = 404;
      throw err;
    }
    const resources = await Resource.getByLessonId(lessonId);
    const progress = userId && courseId ? await CourseProgress.getByUserAndCourse(userId, courseId) : [];
    return {
      ...lesson,
      resources,
      completed: progress.some(entry => entry.lesson_id === parseInt(lessonId) && entry.completed),
    };
  }

  async createCourse(courseData) {
    return Course.create(courseData);
  }

  async updateLessonProgress(userId, courseId, lessonId, completed = true) {
    const course = await Course.findById(courseId);
    if (!course) {
      const err = new Error('Course not found.');
      err.statusCode = 404;
      throw err;
    }

    const modules = await CourseModule.getByCourseId(courseId);
    const lessonExists = modules.some(module => module.lessons.some(lesson => lesson.id === parseInt(lessonId)));
    if (!lessonExists) {
      const err = new Error('Lesson does not belong to this course.');
      err.statusCode = 404;
      throw err;
    }

    await CourseProgress.setLessonCompletion(userId, courseId, lessonId, completed);
    const summary = await this.getCourseProgressSummary(userId, courseId, modules);

    // If 100% completed, automatically generate pending certificate for Admin review
    if (summary.progressPercentage === 100) {
      const certificateService = require('./certificateService');
      await certificateService.generatePendingCertificateIfEligible(userId, courseId);
    }

    return summary;
  }

  async getCourseProgressSummary(userId, courseId, modules) {
    const courseModules = modules || await CourseModule.getByCourseId(courseId);
    const lessons = courseModules.flatMap(module => module.lessons || []);
    const progress = await CourseProgress.getByUserAndCourse(userId, courseId);
    const completedLessonIds = progress.filter(entry => entry.completed).map(entry => entry.lesson_id);
    const completedLessons = lessons.filter(lesson => completedLessonIds.includes(lesson.id)).length;
    const totalLessons = lessons.length;

    return {
      completedLessons,
      totalLessons,
      progressPercentage: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
      completedLessonIds,
    };
  }
}

module.exports = new CourseService();
