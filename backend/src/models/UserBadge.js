const db = require('../config/database');
const Badge = require('./Badge');

class UserBadge {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT ub.*, b.name, b.description, b.icon, b.xp_bonus 
         FROM user_badges ub 
         JOIN badges b ON ub.badge_id = b.id 
         WHERE ub.user_id = $1`,
        [userId]
      );
      return res.rows;
    }
    const allBadges = await Badge.getAll();
    return allBadges.map(b => ({
      ...b,
      badge_id: b.id,
      earned_at: new Date().toISOString(),
    }));
  }
}

module.exports = UserBadge;
