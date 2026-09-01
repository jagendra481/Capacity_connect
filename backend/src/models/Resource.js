const db = require('../config/database');

class Resource {
  static async getByLessonId(lessonId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM resources WHERE lesson_id = $1', [lessonId]);
      return res.rows;
    }
    return [
      { id: 1, lesson_id: parseInt(lessonId), title: 'Architecture Diagram (PDF)', type: 'PDF', file_url: '#' },
      { id: 2, lesson_id: parseInt(lessonId), title: 'Exercise Starter Code (ZIP)', type: 'Document', file_url: '#' },
    ];
  }
}

module.exports = Resource;
