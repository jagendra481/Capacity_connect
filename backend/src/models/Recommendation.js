const db = require('../config/database');

class Recommendation {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM recommendations WHERE user_id = $1 ORDER BY id ASC', [userId]);
      return res.rows;
    }
    return [
      {
        id: 1,
        course_id: 101,
        title: 'Advanced React State & Micro-Frontend Architecture',
        category: 'Engineering',
        reason: 'Critical gap identified in React.js Architecture (Current: 75% vs Required: 85%)',
        priority: 'CRITICAL',
        duration: '8h 45m',
      },
      {
        id: 2,
        course_id: 104,
        title: 'Enterprise AI RAG Architecture & Vector Database',
        category: 'AI',
        reason: 'Critical gap identified in AI RAG & Embeddings (Current: 55% vs Required: 90%)',
        priority: 'CRITICAL',
        duration: '7h 20m',
      },
      {
        id: 3,
        course_id: 102,
        title: 'Node.js Enterprise Microservices & API Gateway',
        category: 'Engineering',
        reason: 'Medium gap identified in Node.js Microservices (Current: 65% vs Required: 80%)',
        priority: 'HIGH',
        duration: '10h 30m',
      },
    ];
  }
}

module.exports = Recommendation;
