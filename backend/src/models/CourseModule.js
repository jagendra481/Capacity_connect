const db = require('../config/database');

class CourseModule {
  static async getByCourseId(courseId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM course_modules WHERE course_id = $1 ORDER BY order_index ASC', [courseId]);
      return res.rows;
    }

    return [
      {
        id: 1,
        course_id: parseInt(courseId),
        title: 'Module 1: Architecture & Foundation Principles',
        description: 'Core concepts, setup, and structural setup for enterprise scale.',
        order_index: 1,
        lessons: [
          {
            id: 1001,
            title: '1.1 System Architecture & Design Paradigms',
            duration: '18 mins',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            is_preview: true,
            completed: true,
          },
          {
            id: 1002,
            title: '1.2 Environment Setup & Directory Conventions',
            duration: '22 mins',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgWgX',
            is_preview: false,
            completed: true,
          },
        ],
      },
      {
        id: 2,
        course_id: parseInt(courseId),
        title: 'Module 2: Advanced Implementation & Patterns',
        description: 'Hands-on practice, modular coding, state management, and edge cases.',
        order_index: 2,
        lessons: [
          {
            id: 1003,
            title: '2.1 Custom Hooks & State Encapsulation',
            duration: '30 mins',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            is_preview: false,
            completed: false,
          },
          {
            id: 1004,
            title: '2.2 API Interceptors & Secure JWT Auth',
            duration: '25 mins',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            is_preview: false,
            completed: false,
          },
        ],
      },
      {
        id: 3,
        course_id: parseInt(courseId),
        title: 'Module 3: Testing, Optimization & Deployment',
        description: 'Automated testing, bundle size optimization, and production pipeline.',
        order_index: 3,
        lessons: [
          {
            id: 1005,
            title: '3.1 Performance Profiling & Code Splitting',
            duration: '35 mins',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            is_preview: false,
            completed: false,
          },
        ],
      },
    ];
  }
}

module.exports = CourseModule;
