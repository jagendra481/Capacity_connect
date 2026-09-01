const db = require('../config/database');

const demoAssessments = [
  {
    id: 1,
    title: 'Full-Stack React & Node Evaluation',
    description: 'Comprehensive test covering React hooks, state management, Express routes, JWT auth, and API architecture.',
    category: 'Engineering',
    passing_score: 70,
    time_limit_minutes: 30,
    difficulty: 'Intermediate',
    skill_id: 1,
    questionsCount: 4,
  },
  {
    id: 2,
    title: 'PostgreSQL Query & Optimization Test',
    description: 'Assess relational database querying, indexing strategies, join operations, and ACID transaction rules.',
    category: 'Database',
    passing_score: 75,
    time_limit_minutes: 20,
    difficulty: 'Advanced',
    skill_id: 3,
    questionsCount: 3,
  },
  {
    id: 3,
    title: 'AI RAG Architecture & Vector Search Exam',
    description: 'Evaluate knowledge on text embeddings, chunking strategies, vector databases, and LLM prompt engineering.',
    category: 'AI',
    passing_score: 80,
    time_limit_minutes: 25,
    difficulty: 'Advanced',
    skill_id: 4,
    questionsCount: 3,
  },
];

class Assessment {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM assessments ORDER BY id ASC');
      return res.rows;
    }
    return demoAssessments;
  }

  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM assessments WHERE id = $1', [id]);
      return res.rows[0];
    }
    return demoAssessments.find(a => a.id === parseInt(id));
  }

  static async create(data) {
    const { title, description, category, passing_score, time_limit_minutes, difficulty, skill_id } = data;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO assessments (title, description, category, passing_score, time_limit_minutes, difficulty, skill_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, category, passing_score, time_limit_minutes, difficulty, skill_id]
      );
      return res.rows[0];
    }

    const newId = demoAssessments.length + 1;
    const newAssessment = {
      id: newId,
      title,
      description,
      category: category || 'Engineering',
      passing_score: passing_score || 70,
      time_limit_minutes: time_limit_minutes || 20,
      difficulty: difficulty || 'Intermediate',
      skill_id: skill_id || 1,
      questionsCount: 0,
    };
    demoAssessments.push(newAssessment);
    return newAssessment;
  }
}

module.exports = Assessment;
