const db = require('../config/database');

class Department {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM departments ORDER BY id ASC');
      return res.rows;
    }
    return db.memoryStore.departments;
  }
}

module.exports = Department;
