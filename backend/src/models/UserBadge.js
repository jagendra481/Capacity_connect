const db = require('../config/database');

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
    return db.memoryStore.userBadges.filter(badge => badge.user_id === parseInt(userId));
  }
}

module.exports = UserBadge;
