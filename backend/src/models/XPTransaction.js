const db = require('../config/database');

const demoXP = [
  { id: 1, user_id: 1, amount: 150, activity_type: 'QuizPass', description: 'Passed Full-Stack React & Node Evaluation with 100%', created_at: new Date().toISOString() },
  { id: 2, user_id: 1, amount: 100, activity_type: 'LessonCompletion', description: 'Completed Lesson 1.1 Architecture & Paradigms', created_at: new Date().toISOString() },
  { id: 3, user_id: 1, amount: 200, activity_type: 'DailyStreak', description: '5-Day Continuous Learning Streak Bonus', created_at: new Date().toISOString() },
];

class XPTransaction {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM xp_transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return res.rows;
    }
    return demoXP.filter(x => x.user_id === parseInt(userId));
  }
}

module.exports = XPTransaction;
