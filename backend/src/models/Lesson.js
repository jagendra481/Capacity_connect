const db = require('../config/database');
const CourseModule = require('./CourseModule');

class Lesson {
  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT l.*, cm.course_id FROM lessons l JOIN course_modules cm ON cm.id = l.module_id WHERE l.id = $1`,
        [id]
      );
      return res.rows[0];
    }

    const numericLessonId = parseInt(id);
    const courseId = Math.floor(numericLessonId / 100);
    const modules = await CourseModule.getByCourseId(courseId);
    const lesson = modules
      .flatMap(module => module.lessons.map(item => ({ ...item, module_id: module.id })))
      .find(item => item.id === numericLessonId);

    if (!lesson) return null;

    return {
      ...lesson,
      course_id: courseId,
      content: `### Lesson overview

This lesson is part of the curated course playlist. Work through the video in sequence, pause to reproduce the examples, and record the decisions or trade-offs you encounter.

#### Practice checklist
1. Summarize the core idea in your own words.
2. Recreate the example in a small local project or lab.
3. Note one question to investigate before the next lesson.
`,
      duration: lesson.duration || 'Playlist lesson',
      resources: [
        { id: 1, title: 'Open the complete YouTube playlist', type: 'Video', file_url: lesson.playlist_url || '#' },
        { id: 2, title: 'Lesson practice checklist', type: 'Document', file_url: '#' },
      ],
    };
  }
}

module.exports = Lesson;
