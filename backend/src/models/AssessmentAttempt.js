const db = require('../config/database');

let demoAttempts = [];

class AssessmentAttempt {
  static async create({ user_id, assessment_id, score, passed, total_questions, correct_count, answers }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO assessment_attempts (user_id, assessment_id, score, passed, total_questions, correct_count, answers)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [user_id, assessment_id, score, passed, total_questions, correct_count, JSON.stringify(answers)]
      );
      return res.rows[0];
    }

    const newAttempt = {
      id: demoAttempts.length + 1,
      user_id: parseInt(user_id),
      assessment_id: parseInt(assessment_id),
      score,
      passed,
      total_questions,
      correct_count,
      answers,
      completed_at: new Date().toISOString(),
    };
    demoAttempts.unshift(newAttempt);
    return newAttempt;
  }

  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT a.*, asm.title as assessment_title 
         FROM assessment_attempts a
         JOIN assessments asm ON a.assessment_id = asm.id
         WHERE a.user_id = $1 ORDER BY a.completed_at DESC`,
        [userId]
      );
      return res.rows;
    }
    return demoAttempts.filter(a => a.user_id === parseInt(userId));
  }

  static async deleteByUserId(userId) {
    const numericId = parseInt(userId);

    if (db.getIsPgConnected()) {
      await db.query('DELETE FROM assessment_attempts WHERE user_id = $1', [numericId]);
      return;
    }

    // Assessment history uses a local demo collection when PostgreSQL is offline.
    // Clear that collection as well so an ID-scoped reset is reflected immediately.
    demoAttempts = demoAttempts.filter(attempt => attempt.user_id !== numericId);
  }
}

module.exports = AssessmentAttempt;
