const db = require('../config/database');

class CourseProgress {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM course_progress WHERE user_id = $1', [userId]);
      return res.rows;
    }
    return db.memoryStore.courseProgress.filter(p => p.user_id === parseInt(userId));
  }

  static async getByUserAndCourse(userId, courseId) {
    const numericUserId = parseInt(userId);
    const numericCourseId = parseInt(courseId);

    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT * FROM course_progress WHERE user_id = $1 AND course_id = $2',
        [numericUserId, numericCourseId]
      );
      return res.rows;
    }

    return db.memoryStore.courseProgress.filter(
      progress => progress.user_id === numericUserId && progress.course_id === numericCourseId
    );
  }

  static async setLessonCompletion(userId, courseId, lessonId, completed) {
    const numericUserId = parseInt(userId);
    const numericCourseId = parseInt(courseId);
    const numericLessonId = parseInt(lessonId);
    const isCompleted = Boolean(completed);

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO course_progress (user_id, course_id, lesson_id, completed, progress_percentage, last_accessed)
         VALUES ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, course_id, lesson_id)
         DO UPDATE SET completed = EXCLUDED.completed, last_accessed = CURRENT_TIMESTAMP
         RETURNING *`,
        [numericUserId, numericCourseId, numericLessonId, isCompleted]
      );
      return res.rows[0];
    }

    const existing = db.memoryStore.courseProgress.find(
      progress => progress.user_id === numericUserId
        && progress.course_id === numericCourseId
        && progress.lesson_id === numericLessonId
    );

    if (existing) {
      existing.completed = isCompleted;
      existing.last_accessed = new Date().toISOString();
      return existing;
    }

    const progress = {
      id: db.memoryStore.courseProgress.length + 1,
      user_id: numericUserId,
      course_id: numericCourseId,
      lesson_id: numericLessonId,
      completed: isCompleted,
      progress_percentage: 0,
      last_accessed: new Date().toISOString(),
    };
    db.memoryStore.courseProgress.push(progress);
    return progress;
  }
}

module.exports = CourseProgress;
