const db = require('../config/database');

const demoXP = [];

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
