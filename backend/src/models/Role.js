const db = require('../config/database');

class Role {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM roles ORDER BY id ASC');
      return res.rows;
    }
    return db.memoryStore.roles;
  }
}

module.exports = Role;
