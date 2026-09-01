const db = require('../config/database');

class Skill {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM skills ORDER BY name ASC');
      return res.rows;
    }
    if (db.memoryStore.skills.length === 0) {
      db.memoryStore.skills = [
        { id: 1, name: 'React.js Frontend Architecture', category: 'Engineering' },
        { id: 2, name: 'Node.js & Microservices', category: 'Engineering' },
        { id: 3, name: 'PostgreSQL Database Optimization', category: 'Database' },
        { id: 4, name: 'AI & Machine Learning Foundations', category: 'AI' },
        { id: 5, name: 'Cyber Security Essentials', category: 'Security' },
      ];
    }
    return db.memoryStore.skills;
  }
}

module.exports = Skill;
