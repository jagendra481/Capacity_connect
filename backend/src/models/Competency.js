const db = require('../config/database');

class Competency {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM competencies WHERE user_id = $1', [userId]);
      return res.rows;
    }
    const userCompetencies = db.memoryStore.competencies.filter(c => c.user_id === parseInt(userId));
    if (userCompetencies.length === 0) {
      return [
        { skill: 'React.js', required: 85, current: 75, month: 'Jan' },
        { skill: 'Node.js', required: 80, current: 65, month: 'Feb' },
        { skill: 'PostgreSQL', required: 75, current: 80, month: 'Mar' },
        { skill: 'AI RAG', required: 90, current: 55, month: 'Apr' },
        { skill: 'DevOps', required: 70, current: 60, month: 'May' },
      ];
    }
    return userCompetencies;
  }
}

module.exports = Competency;
