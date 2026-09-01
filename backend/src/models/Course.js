const db = require('../config/database');

const defaultDemoCourses = [
  {
    id: 101,
    title: 'Advanced React State & Micro-Frontend Architecture',
    description: 'Master enterprise React application design, state management with Context & Redux, custom hooks, dynamic loading, and component performance optimization.',
    category: 'Engineering',
    level: 'Advanced',
    duration: '8h 45m',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    prerequisites: 'Basic JavaScript & React fundamentals',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 16,
  },
  {
    id: 102,
    title: 'Node.js Enterprise Microservices & API Gateway',
    description: 'Build scalable REST & GraphQL APIs using Express, PostgreSQL, JWT authentication, Redis caching, microservices messaging, and Docker deployment.',
    category: 'Engineering',
    level: 'Intermediate',
    duration: '10h 30m',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    prerequisites: 'JavaScript ES6 & Node basics',
    status: 'published',
    modulesCount: 5,
    lessonsCount: 20,
  },
  {
    id: 103,
    title: 'PostgreSQL Advanced Querying & Performance Tuning',
    description: 'Deep dive into relational schema normalization, indexes (B-Tree, GIN), query planner execution plans, connection pooling, and ACID transaction isolation.',
    category: 'Database',
    level: 'Intermediate',
    duration: '6h 15m',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Marcus Vance',
    prerequisites: 'Basic SQL syntax',
    status: 'published',
    modulesCount: 3,
    lessonsCount: 12,
  },
  {
    id: 104,
    title: 'Enterprise AI RAG Architecture & Vector Database',
    description: 'Implement Retrieval-Augmented Generation (RAG) using OpenAI/Gemini APIs, vector embeddings, chunking strategies, and course material knowledge bases.',
    category: 'AI',
    level: 'Advanced',
    duration: '7h 20m',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    prerequisites: 'Python or Node.js backend development',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 14,
  },
];

class Course {
  static async getAll({ search = '', category = '', level = '' } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = 'SELECT * FROM courses WHERE 1=1';
      const params = [];
      if (search) {
        params.push(`%${search}%`);
        queryStr += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }
      if (category) {
        params.push(category);
        queryStr += ` AND category = $${params.length}`;
      }
      if (level) {
        params.push(level);
        queryStr += ` AND level = $${params.length}`;
      }
      queryStr += ' ORDER BY id DESC';
      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let filtered = defaultDemoCourses;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (category) {
      filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (level) {
      filtered = filtered.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }
    return filtered;
  }

  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
      return res.rows[0];
    }
    return defaultDemoCourses.find(c => c.id === parseInt(id));
  }

  static async create(courseData) {
    const { title, description, category, level, duration, thumbnail_url, trainer_id, prerequisites } = courseData;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO courses (title, description, category, level, duration, thumbnail_url, trainer_id, prerequisites)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description, category, level, duration, thumbnail_url, trainer_id, prerequisites]
      );
      return res.rows[0];
    }

    const newId = defaultDemoCourses.length + 101;
    const newCourse = {
      id: newId,
      title,
      description,
      category: category || 'Engineering',
      level: level || 'Intermediate',
      duration: duration || '4h 00m',
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      trainer_name: 'Technical Trainer',
      prerequisites: prerequisites || 'None',
      status: 'published',
      modulesCount: 2,
      lessonsCount: 6,
    };
    defaultDemoCourses.unshift(newCourse);
    return newCourse;
  }
}

module.exports = Course;
