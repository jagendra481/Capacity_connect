const db = require('../config/database');

class CourseProgress {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM course_progress WHERE user_id = $1', [userId]);
      return res.rows;
    }
    return db.memoryStore.courseProgress.filter(p => p.user_id === parseInt(userId));
  }
}

module.exports = CourseProgress;
