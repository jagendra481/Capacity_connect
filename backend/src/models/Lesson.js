const db = require('../config/database');

class Lesson {
  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM lessons WHERE id = $1', [id]);
      return res.rows[0];
    }
    return {
      id: parseInt(id),
      module_id: 1,
      course_id: 101,
      title: '1.1 System Architecture & Design Paradigms',
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
