const db = require('../config/database');

const defaultDemoCourses = [
  {
    id: 101,
    title: 'Modern React Architecture & Performance',
    description: 'Build production-ready React applications with component design, hooks, routing, state patterns, performance tuning, and deployment practices.',
    category: 'Engineering',
    level: 'Advanced',
    duration: '12h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    trainer_id: 2,
    prerequisites: 'JavaScript ES6 and HTML/CSS fundamentals',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'Full Modern React Tutorial',
    playlist_url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
    playlist_id: 'PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
    enrolledCount: 18,
    completionRate: 85,
    avgScore: 92,
  },
  {
    id: 102,
    title: 'Node.js, Express & API Engineering',
    description: 'Develop secure backend services with Node.js, Express, REST APIs, routing, middleware, data persistence, and an MVC structure.',
    category: 'Engineering',
    level: 'Intermediate',
    duration: '10h 30m',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    trainer_id: 2,
    prerequisites: 'JavaScript ES6 and basic command-line use',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'Node.js Crash Course Tutorial',
    playlist_url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU',
    playlist_id: 'PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU',
    enrolledCount: 14,
    completionRate: 78,
    avgScore: 88,
  },
  {
    id: 103,
    title: 'PostgreSQL Querying & Database Performance',
    description: 'Design reliable relational databases, write expressive SQL, understand joins and transactions, and apply indexing and query-performance techniques.',
    category: 'Database',
    level: 'Intermediate',
    duration: '8h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    trainer_id: 2,
    prerequisites: 'Basic SQL concepts',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'PostgreSQL Full Playlist',
    playlist_url: 'https://www.youtube.com/playlist?list=PLSU32T6nmU25qowhWMM4ZUDUbSvsV78GG',
    playlist_id: 'PLSU32T6nmU25qowhWMM4ZUDUbSvsV78GG',
    enrolledCount: 12,
    completionRate: 90,
    avgScore: 94,
  },
  {
    id: 104,
    title: 'Production RAG Systems & Vector Search',
    description: 'Create grounded AI applications with document indexing, embeddings, vector retrieval, prompt construction, evaluation, and advanced RAG patterns.',
    category: 'AI',
    level: 'Advanced',
    duration: '9h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    trainer_id: 2,
    prerequisites: 'Python or JavaScript and LLM API basics',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'RAG From Scratch',
    playlist_url: 'https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x',
    playlist_id: 'PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x',
    enrolledCount: 9,
    completionRate: 70,
    avgScore: 86,
  },
  {
    id: 105,
    title: 'Python Foundations for Automation & Data',
    description: 'Gain a practical Python foundation covering core syntax, data structures, functions, modules, virtual environments, and automation workflows.',
    category: 'Programming',
    level: 'Beginner',
    duration: '15h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Corey Schafer',
    trainer_id: null,
    prerequisites: 'No programming experience required',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'Python Tutorials',
    playlist_url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    playlist_id: 'PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    enrolledCount: 22,
    completionRate: 95,
    avgScore: 91,
  },
  {
    id: 106,
    title: 'Cybersecurity Foundations & Ethical Hacking',
    description: 'Learn security fundamentals through networking, threat modelling, Linux and security tools, vulnerability analysis, and practical defensive habits.',
    category: 'Security',
    level: 'Beginner',
    duration: '11h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Security Admin',
    trainer_id: null,
    prerequisites: 'Basic computer and networking concepts',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'Ethical Hacking Course Series',
    playlist_url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbnklGh3FNRLECx_2D_vK3mu',
    playlist_id: 'PLWKjhJtqVAbnklGh3FNRLECx_2D_vK3mu',
    enrolledCount: 15,
    completionRate: 60,
    avgScore: 84,
  },
  {
    id: 107,
    title: 'Azure Cloud Architecture & DevOps',
    description: 'Build cloud fluency with Azure fundamentals, infrastructure design, deployment concepts, monitoring, security, and scalable delivery practices.',
    category: 'Cloud',
    level: 'Intermediate',
    duration: '10h 00m',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    trainer_name: 'Dr. Sarah Connor',
    trainer_id: 2,
    prerequisites: 'Linux basics and application-development familiarity',
    status: 'published',
    modulesCount: 4,
    lessonsCount: 8,
    playlist_title: 'Azure Training',
    playlist_url: 'https://www.youtube.com/playlist?list=PLEiEAq2VkUULWRHXW2RMpqFVnHOJHtzYT',
    playlist_id: 'PLEiEAq2VkUULWRHXW2RMpqFVnHOJHtzYT',
    enrolledCount: 11,
    completionRate: 82,
    avgScore: 89,
  },
];

class Course {
  static async getAll({ search = '', category = '', level = '', status = '' } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = 'SELECT * FROM courses WHERE 1=1';
      const params = [];
      if (search) {
        params.push('%' + search + '%');
        queryStr += ' AND (title ILIKE $' + params.length + ' OR description ILIKE $' + params.length + ')';
      }
      if (category) {
        params.push(category);
        queryStr += ' AND category = $' + params.length;
      }
      if (level) {
        params.push(level);
        queryStr += ' AND level = $' + params.length;
      }
      if (status) {
        params.push(status);
        queryStr += ' AND status = $' + params.length;
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
    if (category) filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
    if (level) filtered = filtered.filter(c => c.level.toLowerCase() === level.toLowerCase());
    if (status) filtered = filtered.filter(c => (c.status || 'published').toLowerCase() === status.toLowerCase());
    return filtered;
  }

  static async findById(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM courses WHERE id = $1', [numericId]);
      return res.rows[0];
    }
    return defaultDemoCourses.find(c => c.id === numericId);
  }

  static async create(courseData) {
    const { title, description, category, level, duration, thumbnail_url, trainer_id, trainer_name, prerequisites, status = 'published' } = courseData;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'INSERT INTO courses (title, description, category, level, duration, thumbnail_url, trainer_id, prerequisites, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [title, description, category, level, duration, thumbnail_url, trainer_id, prerequisites, status]
      );
      return res.rows[0];
    }
    const newId = Math.max(...defaultDemoCourses.map(c => c.id), 100) + 1;
    const newCourse = {
      id: newId,
      title,
      description,
      category: category || 'Engineering',
      level: level || 'Intermediate',
      duration: duration || '4h 00m',
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      trainer_name: trainer_name || 'Dr. Sarah Connor',
      trainer_id: trainer_id || 2,
      prerequisites: prerequisites || 'None',
      status: status || 'published',
      modulesCount: 2,
      lessonsCount: 4,
      enrolledCount: 0,
      completionRate: 0,
      avgScore: 0,
    };
    defaultDemoCourses.unshift(newCourse);
    return newCourse;
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
      const res = await db.query('UPDATE courses SET ' + fields.join(', ') + ' WHERE id = $' + idx + ' RETURNING *', values);
      return res.rows[0];
    }
    const c = defaultDemoCourses.find(course => course.id === numericId);
    if (c) {
      Object.assign(c, updates);
      return c;
    }
    return null;
  }

  static async delete(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      await db.query('DELETE FROM courses WHERE id = $1', [numericId]);
      return true;
    }
    const idx = defaultDemoCourses.findIndex(c => c.id === numericId);
    if (idx !== -1) {
      defaultDemoCourses.splice(idx, 1);
      return true;
    }
    return false;
  }

  static async assignTrainer(courseId, trainerId) {
    const numericCourseId = parseInt(courseId);
    const numericTrainerId = parseInt(trainerId);
    const user = (db.memoryStore.users || []).find(u => u.id === numericTrainerId);
    const trainerName = user?.full_name || 'Assigned Trainer';

    return this.update(numericCourseId, { trainer_id: numericTrainerId, trainer_name: trainerName });
  }

  static async getEnrolledTrainees(courseId) {
    const numericCourseId = parseInt(courseId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT DISTINCT u.id, u.full_name, u.email, u.status, COALESCE(MAX(cp.progress_percentage), 0) as progress_percentage, MAX(cp.last_accessed) as last_accessed FROM course_progress cp JOIN users u ON cp.user_id = u.id WHERE cp.course_id = $1 GROUP BY u.id, u.full_name, u.email, u.status',
        [numericCourseId]
      );
      return res.rows;
    }

    const progressEntries = (db.memoryStore.courseProgress || []).filter(cp => cp.course_id === numericCourseId);
    const userMap = new Map();

    for (const p of progressEntries) {
      if (!userMap.has(p.user_id)) {
        const u = (db.memoryStore.users || []).find(user => user.id === p.user_id);
        if (u) {
          userMap.set(p.user_id, {
            id: u.id,
            full_name: u.full_name,
            email: u.email,
            status: u.status || 'active',
            progress_percentage: p.progress_percentage || (p.completed ? 100 : 50),
            last_accessed: p.last_accessed || new Date().toISOString(),
          });
        }
      }
    }

    // If no progress entries yet for this course, provide demo trainee enrollment
    if (userMap.size === 0 && numericCourseId === 101) {
      userMap.set(1, {
        id: 1,
        full_name: 'Alex Johnson',
        email: 'trainee@capacityconnect.com',
        status: 'active',
        progress_percentage: 100,
        last_accessed: new Date().toISOString(),
      });
    }

    return Array.from(userMap.values());
  }

  static async enrollTrainee(courseId, userId) {
    const numericCourseId = parseInt(courseId);
    const numericUserId = parseInt(userId);

    const CourseProgress = require('./CourseProgress');
    return CourseProgress.setLessonCompletion(numericUserId, numericCourseId, 10101, false);
  }
}

module.exports = Course;
