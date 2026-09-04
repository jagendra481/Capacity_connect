const db = require('../config/database');
const CourseModule = require('./CourseModule');

class Lesson {
  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT l.*, cm.course_id
         FROM lessons l
         JOIN course_modules cm ON cm.id = l.module_id
         WHERE l.id = $1`,
        [id]
      );
      return res.rows[0];
    }
    const numericLessonId = parseInt(id);
    const courseId = Math.floor(numericLessonId / 100);
    const modules = await CourseModule.getByCourseId(courseId);
    const lesson = modules.flatMap(module => module.lessons.map(item => ({ ...item, module_id: module.id })))
      .find(item => item.id === numericLessonId);
    if (!lesson) return null;
    return {
      ...lesson,
      course_id: courseId,
      content: `### Lesson Overview

Welcome to this comprehensive technical lesson. In this module, we explore modern enterprise software design principles.

#### Key Takeaways
1. **Clean Architecture**: Decouple business logic from UI components and framework details.
2. **State Management**: Utilize centralized React contexts and hooks for transparent data flow.
3. **Resilient APIs**: Intercept requests with JWT headers and standardize error responses.

#### Code Example
\`\`\`javascript
const fetchCourseData = async (courseId) => {
  const response = await api.get(\`/courses/\${courseId}\`);
  return response.data;
};
\`\`\`
`,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '18 mins',
      resources: [
        { id: 1, title: 'Architecture Cheatsheet (PDF)', type: 'PDF', file_url: '#' },
        { id: 2, title: 'Sample Source Code Repository', type: 'Document', file_url: '#' },
      ],
    };
  }
}

module.exports = Lesson;
