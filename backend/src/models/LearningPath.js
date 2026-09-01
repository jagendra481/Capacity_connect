const db = require('../config/database');

const demoPaths = [
  {
    id: 1,
    title: 'Senior Full-Stack Engineer Learning Path',
    description: 'Structured sequential path to bridge React, Node.js, and PostgreSQL capacity gaps.',
    target_role: 'trainee',
    steps: [
      { step: 1, course_id: 101, title: 'React.js Architecture Mastery', duration: '8h 45m', status: 'In Progress' },
      { step: 2, course_id: 102, title: 'Node.js Microservices & API Design', duration: '10h 30m', status: 'Pending' },
      { step: 3, course_id: 103, title: 'PostgreSQL Query Optimization', duration: '6h 15m', status: 'Pending' },
    ],
  },
  {
    id: 2,
    title: 'AI Systems & RAG Specialist Path',
    description: 'Targeted learning sequence to master vector embeddings, RAG pipelines, and LLM integrations.',
    target_role: 'trainee',
    steps: [
      { step: 1, course_id: 104, title: 'Enterprise AI RAG Architecture', duration: '7h 20m', status: 'Pending' },
      { step: 2, course_id: 102, title: 'Node.js Microservices Integration', duration: '10h 30m', status: 'Pending' },
    ],
  },
];

class LearningPath {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM learning_paths ORDER BY id ASC');
      return res.rows;
    }
    return demoPaths;
  }
}

module.exports = LearningPath;
