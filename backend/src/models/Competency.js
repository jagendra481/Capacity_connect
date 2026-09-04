const db = require('../config/database');

class Competency {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM competencies WHERE user_id = $1', [userId]);
      return res.rows;
    }
    return db.memoryStore.competencies.filter(c => c.user_id === parseInt(userId));
  }
}

module.exports = Competency;
