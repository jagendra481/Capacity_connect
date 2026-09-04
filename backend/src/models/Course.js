const db = require('../config/database');

// The fallback catalog is also used when PostgreSQL is not configured locally.
// Each course has a curated, course-specific YouTube series rather than a generic video.
const defaultDemoCourses = [
  {
    id: 101,
    title: 'Modern React Architecture & Performance',
    description: 'Build production-ready React applications with component design, hooks, routing, state patterns, performance tuning, and deployment practices.',
    category: 'Engineering', level: 'Advanced', duration: '12h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Net Ninja', prerequisites: 'JavaScript ES6 and HTML/CSS fundamentals', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'Full Modern React Tutorial',
    playlist_url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
    playlist_id: 'PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
  },
  {
    id: 102,
    title: 'Node.js, Express & API Engineering',
    description: 'Develop secure backend services with Node.js, Express, REST APIs, routing, middleware, data persistence, and an MVC structure.',
    category: 'Engineering', level: 'Intermediate', duration: '10h 30m',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Net Ninja', prerequisites: 'JavaScript ES6 and basic command-line use', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'Node.js Crash Course Tutorial',
    playlist_url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU',
    playlist_id: 'PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU',
  },
  {
    id: 103,
    title: 'PostgreSQL Querying & Database Performance',
    description: 'Design reliable relational databases, write expressive SQL, understand joins and transactions, and apply indexing and query-performance techniques.',
    category: 'Database', level: 'Intermediate', duration: '8h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Knowledge 360', prerequisites: 'Basic SQL concepts', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'PostgreSQL Full Playlist',
    playlist_url: 'https://www.youtube.com/playlist?list=PLSU32T6nmU25qowhWMM4ZUDUbSvsV78GG',
    playlist_id: 'PLSU32T6nmU25qowhWMM4ZUDUbSvsV78GG',
  },
  {
    id: 104,
    title: 'Production RAG Systems & Vector Search',
    description: 'Create grounded AI applications with document indexing, embeddings, vector retrieval, prompt construction, evaluation, and advanced RAG patterns.',
    category: 'AI', level: 'Advanced', duration: '9h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'LangChain', prerequisites: 'Python or JavaScript and LLM API basics', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'RAG From Scratch',
    playlist_url: 'https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x',
    playlist_id: 'PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x',
  },
  {
    id: 105,
    title: 'Python Foundations for Automation & Data',
    description: 'Gain a practical Python foundation covering core syntax, data structures, functions, modules, virtual environments, and automation workflows.',
    category: 'Programming', level: 'Beginner', duration: '15h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Corey Schafer', prerequisites: 'No programming experience required', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'Python Tutorials',
    playlist_url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    playlist_id: 'PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
  },
  {
    id: 106,
    title: 'Cybersecurity Foundations & Ethical Hacking',
    description: 'Learn security fundamentals through networking, threat modelling, Linux and security tools, vulnerability analysis, and practical defensive habits.',
    category: 'Security', level: 'Beginner', duration: '11h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'freeCodeCamp.org', prerequisites: 'Basic computer and networking concepts', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'Ethical Hacking Course Series',
    playlist_url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbnklGh3FNRLECx_2D_vK3mu',
    playlist_id: 'PLWKjhJtqVAbnklGh3FNRLECx_2D_vK3mu',
  },
  {
    id: 107,
    title: 'Azure Cloud Architecture & DevOps',
    description: 'Build cloud fluency with Azure fundamentals, infrastructure design, deployment concepts, monitoring, security, and scalable delivery practices.',
    category: 'Cloud', level: 'Intermediate', duration: '10h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Simplilearn', prerequisites: 'Linux basics and application-development familiarity', status: 'published',
    modulesCount: 4, lessonsCount: 8,
    playlist_title: 'Azure Training',
    playlist_url: 'https://www.youtube.com/playlist?list=PLEiEAq2VkUULWRHXW2RMpqFVnHOJHtzYT',
    playlist_id: 'PLEiEAq2VkUULWRHXW2RMpqFVnHOJHtzYT',
  },
];

class Course {
  static async getAll({ search = '', category = '', level = '' } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = 'SELECT * FROM courses WHERE 1=1';
      const params = [];
      if (search) { params.push(`%${search}%`); queryStr += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`; }
      if (category) { params.push(category); queryStr += ` AND category = $${params.length}`; }
      if (level) { params.push(level); queryStr += ` AND level = $${params.length}`; }
      queryStr += ' ORDER BY id DESC';
      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let filtered = defaultDemoCourses;
    if (search) { const q = search.toLowerCase(); filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)); }
    if (category) filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
    if (level) filtered = filtered.filter(c => c.level.toLowerCase() === level.toLowerCase());
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
    const newCourse = {
      id: Math.max(...defaultDemoCourses.map(course => course.id)) + 1, title, description,
      category: category || 'Engineering', level: level || 'Intermediate', duration: duration || '4h 00m',
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      trainer_name: 'Technical Trainer', prerequisites: prerequisites || 'None', status: 'published', modulesCount: 2, lessonsCount: 6,
    };
    defaultDemoCourses.unshift(newCourse);
    return newCourse;
  }
}

module.exports = Course;
