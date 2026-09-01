const db = require('../config/database');

const demoBadges = [
  { id: 1, name: 'Quick Starter', description: 'Completed 1st course lesson', icon: 'Zap', xp_bonus: 100 },
  { id: 2, name: 'Skill Champion', description: 'Achieved >70% competency score', icon: 'Award', xp_bonus: 200 },
  { id: 3, name: 'Streak Master', description: 'Maintained 5 consecutive study days', icon: 'CheckCircle', xp_bonus: 150 },
  { id: 4, name: 'Quiz Ace', description: 'Scored 100% on a technical assessment', icon: 'Star', xp_bonus: 250 },
];

class Badge {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM badges ORDER BY id ASC');
      return res.rows;
    }
    return demoBadges;
  }
}

module.exports = Badge;
