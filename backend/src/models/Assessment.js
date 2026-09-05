const db = require('../config/database');

const defaultDemoAssessments = [
  {
    id: 1,
    course_id: 101,
    title: 'Modern React Architecture & Component Mastery Exam',
    description: 'Comprehensive evaluation of React 18 component design, custom hooks, context boundaries, and render optimization.',
    passing_score: 75,
    time_limit_minutes: 45,
    total_questions: 10,
    status: 'published',
    course_title: 'Modern React Architecture & Performance',
    total_attempts: 18,
    avg_score: 84.5,
    pass_rate: 88.8,
  },
  {
    id: 2,
    course_id: 102,
    title: 'Enterprise Node.js & Microservices Competency Assessment',
    description: 'Practical evaluation covering REST API design, middleware pipelines, JWT auth, and microservice decoupling.',
    passing_score: 80,
    time_limit_minutes: 60,
    total_questions: 12,
    status: 'published',
    course_title: 'Node.js, Express & API Engineering',
    total_attempts: 14,
    avg_score: 82.1,
    pass_rate: 85.7,
  },
  {
    id: 3,
    course_id: 103,
    title: 'Relational Database Architecture & Query Tuning Test',
    description: 'Evaluation of normalized schema design, indexing strategies, ACID transactions, and query plan diagnosis.',
    passing_score: 70,
    time_limit_minutes: 40,
    total_questions: 8,
    status: 'published',
    course_title: 'PostgreSQL Querying & Database Performance',
    total_attempts: 12,
    avg_score: 91.0,
    pass_rate: 91.6,
  },
  {
    id: 4,
    course_id: 104,
    title: 'Production RAG Vector Search & Prompt Engineering Benchmark',
    description: 'Advanced assessment of chunking strategies, vector embeddings, grounded generation, and LLM evaluation metrics.',
    passing_score: 75,
    time_limit_minutes: 50,
    total_questions: 10,
    status: 'published',
    course_title: 'Production RAG Systems & Vector Search',
    total_attempts: 9,
    avg_score: 79.4,
    pass_rate: 77.7,
  }
];

class Assessment {
  static async getAll({ courseId = null, search = '' } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = 'SELECT a.*, c.title as course_title, COUNT(DISTINCT aa.id) as total_attempts, ROUND(AVG(aa.score), 1) as avg_score, ROUND(COUNT(CASE WHEN aa.passed THEN 1 END) * 100.0 / NULLIF(COUNT(aa.id), 0), 1) as pass_rate FROM assessments a LEFT JOIN courses c ON a.course_id = c.id LEFT JOIN assessment_attempts aa ON a.id = aa.assessment_id WHERE 1=1';
      const params = [];

      if (courseId) {
        params.push(parseInt(courseId));
        queryStr += ' AND a.course_id = $' + params.length;
      }
      if (search) {
        params.push('%' + search + '%');
        queryStr += ' AND (a.title ILIKE $' + params.length + ' OR a.description ILIKE $' + params.length + ')';
      }

      queryStr += ' GROUP BY a.id, c.title ORDER BY a.id ASC';
      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let items = defaultDemoAssessments;
    if (courseId) items = items.filter(a => a.course_id === parseInt(courseId));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return items;
  }

  static async findById(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT a.*, c.title as course_title FROM assessments a LEFT JOIN courses c ON a.course_id = c.id WHERE a.id = $1',
        [numericId]
      );
      return res.rows[0];
    }
    return defaultDemoAssessments.find(a => a.id === numericId);
  }

  static async create({ course_id, title, description, passing_score = 75, time_limit_minutes = 45, status = 'published' }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'INSERT INTO assessments (course_id, title, description, passing_score, time_limit_minutes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [course_id, title, description, passing_score, time_limit_minutes, status]
      );
      return res.rows[0];
    }

    const newId = Math.max(...defaultDemoAssessments.map(a => a.id), 0) + 1;
    const course = (db.memoryStore.courses || []).find(c => c.id === parseInt(course_id));
    const newAssessment = {
      id: newId,
      course_id: parseInt(course_id),
      title,
      description,
      passing_score: parseInt(passing_score),
      time_limit_minutes: parseInt(time_limit_minutes),
      status,
      course_title: course?.title || 'Advanced Technical Course',
      total_attempts: 0,
      avg_score: 0,
      pass_rate: 0,
    };
    defaultDemoAssessments.push(newAssessment);
    return newAssessment;
  }

  static async update(id, updates) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const fields = [];
      const values = [];
      let idx = 1;
      for (const [k, v] of Object.entries(updates)) {
        fields.push(k + ' = $' + idx);
        values.push(v);
        idx++;
      }
      values.push(numericId);
      const res = await db.query('UPDATE assessments SET ' + fields.join(', ') + ' WHERE id = $' + idx + ' RETURNING *', values);
      return res.rows[0];
    }

    const a = defaultDemoAssessments.find(item => item.id === numericId);
    if (a) {
      Object.assign(a, updates);
      return a;
    }
    return null;
  }

  static async delete(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      await db.query('DELETE FROM assessments WHERE id = $1', [numericId]);
      return true;
    }
    const idx = defaultDemoAssessments.findIndex(a => a.id === numericId);
    if (idx !== -1) {
      defaultDemoAssessments.splice(idx, 1);
      return true;
    }
    return false;
  }

  static async getAttempts(assessmentId) {
    const numericId = parseInt(assessmentId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT aa.*, u.full_name as trainee_name, u.email as trainee_email FROM assessment_attempts aa JOIN users u ON aa.user_id = u.id WHERE aa.assessment_id = $1 ORDER BY aa.created_at DESC',
        [numericId]
      );
      return res.rows;
    }

    const attempts = (db.memoryStore.assessmentAttempts || []).filter(a => a.assessment_id === numericId);
    if (attempts.length > 0) {
      return attempts.map(attempt => {
        const u = (db.memoryStore.users || []).find(user => user.id === attempt.user_id);
        return {
          ...attempt,
          trainee_name: u?.full_name || 'Alex Johnson',
          trainee_email: u?.email || 'trainee@capacityconnect.com',
        };
      });
    }

    // Default sample attempts for demo viewing
    return [
      {
        id: 1,
        assessment_id: numericId,
        user_id: 1,
        trainee_name: 'Alex Johnson',
        trainee_email: 'trainee@capacityconnect.com',
        score: 92,
        passed: true,
        duration_minutes: 32,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 2,
        assessment_id: numericId,
        user_id: 4,
        trainee_name: 'Priya Sharma',
        trainee_email: 'priya.sharma@moes.gov.in',
        score: 86,
        passed: true,
        duration_minutes: 38,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 3,
        assessment_id: numericId,
        user_id: 5,
        trainee_name: 'Rahul Verma',
        trainee_email: 'rahul.verma@incois.gov.in',
        score: 64,
        passed: false,
        duration_minutes: 42,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      }
    ];
  }
}

module.exports = Assessment;
