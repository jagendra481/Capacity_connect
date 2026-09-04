const db = require('../config/database');

const buildDemoModules = (courseId) => {
  const numericCourseId = parseInt(courseId);
  const lessonId = (index) => numericCourseId * 100 + index;

  return [
    {
      id: numericCourseId * 10 + 1,
      course_id: numericCourseId,
      title: 'Module 1: Architecture & Foundation Principles',
      description: 'Core concepts, setup, and structural foundations for enterprise-scale work.',
      order_index: 1,
      lessons: [
        { id: lessonId(1), title: '1.1 System Architecture & Design Paradigms', duration: '18 mins', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', is_preview: true },
        { id: lessonId(2), title: '1.2 Environment Setup & Directory Conventions', duration: '22 mins', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', is_preview: false },
      ],
    },
    {
      id: numericCourseId * 10 + 2,
      course_id: numericCourseId,
      title: 'Module 2: Advanced Implementation & Patterns',
      description: 'Hands-on practice, modular coding, state management, and edge cases.',
      order_index: 2,
      lessons: [
        { id: lessonId(3), title: '2.1 Custom Hooks & State Encapsulation', duration: '30 mins', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', is_preview: false },
        { id: lessonId(4), title: '2.2 API Interceptors & Secure JWT Auth', duration: '25 mins', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', is_preview: false },
      ],
    },
    {
      id: numericCourseId * 10 + 3,
      course_id: numericCourseId,
      title: 'Module 3: Testing, Optimization & Deployment',
      description: 'Automated testing, performance optimization, and production delivery.',
      order_index: 3,
      lessons: [
        { id: lessonId(5), title: '3.1 Performance Profiling & Code Splitting', duration: '35 mins', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', is_preview: false },
        { id: lessonId(6), title: '3.2 Release Validation & Deployment', duration: '28 mins', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', is_preview: false },
      ],
    },
  ];
};

class CourseModule {
  static async getByCourseId(courseId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT cm.*, l.id AS lesson_id, l.title AS lesson_title, l.duration AS lesson_duration,
                l.video_url AS lesson_video_url, l.is_preview AS lesson_is_preview, l.order_index AS lesson_order_index
         FROM course_modules cm
         LEFT JOIN lessons l ON l.module_id = cm.id
         WHERE cm.course_id = $1
         ORDER BY cm.order_index ASC, l.order_index ASC`,
        [courseId]
      );

      const modules = new Map();
      for (const row of res.rows) {
        if (!modules.has(row.id)) {
          modules.set(row.id, {
            id: row.id,
            course_id: row.course_id,
            title: row.title,
            description: row.description,
            order_index: row.order_index,
            lessons: [],
          });
        }
        if (row.lesson_id) {
          modules.get(row.id).lessons.push({
            id: row.lesson_id,
            title: row.lesson_title,
            duration: row.lesson_duration,
            video_url: row.lesson_video_url,
            is_preview: row.lesson_is_preview,
          });
        }
      }
      return [...modules.values()];
    }

    return buildDemoModules(courseId);
  }
}

module.exports = CourseModule;
