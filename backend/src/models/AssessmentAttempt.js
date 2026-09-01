const db = require('../config/database');

const demoAttempts = [
  {
    id: 1,
    user_id: 1,
    assessment_id: 1,
    assessment_title: 'Full-Stack React & Node Evaluation',
    score: 100,
    passed: true,
    total_questions: 4,
    correct_count: 4,
    completed_at: new Date().toISOString(),
  },
];

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
}

module.exports = AssessmentAttempt;
