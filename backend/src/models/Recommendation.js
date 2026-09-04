const db = require('../config/database');

class Recommendation {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM recommendations WHERE user_id = $1 ORDER BY id ASC', [userId]);
      return res.rows;
    }
    return db.memoryStore.recommendations.filter(item => item.user_id === parseInt(userId));
  }
}

module.exports = Recommendation;
