const db = require('../config/database');

const demoSessions = [
  {
    id: 1,
    title: 'Enterprise React 19 & Concurrent Rendering Workshop',
    description: 'Live interactive coding session covering Server Components, useActionState, and micro-frontend state sync.',
    category: 'Engineering',
    trainer_name: 'Sarah Jenkins',
    meeting_link: 'https://meet.capacityconnect.com/react-workshop',
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 90000000).toISOString(),
    capacity: 40,
    rsvp_count: 18,
  },
  {
    id: 2,
    title: 'PostgreSQL Indexing & High-Availability Masterclass',
    description: 'Hands-on query plan tuning, connection pooling with PgBouncer, and streaming replication setup.',
    category: 'Database',
    trainer_name: 'David Miller',
    meeting_link: 'https://meet.capacityconnect.com/postgres-masterclass',
    start_time: new Date(Date.now() + 172800000).toISOString(),
    end_time: new Date(Date.now() + 176400000).toISOString(),
    capacity: 35,
    rsvp_count: 24,
  },
  {
    id: 3,
    title: 'AI RAG Pipeline & Vector Search Webinar',
    description: 'Deep dive into text chunking, embedding models, and hybrid keyword-vector retrieval in production.',
    category: 'AI',
    trainer_name: 'Michael Chang',
    meeting_link: 'https://meet.capacityconnect.com/rag-webinar',
    start_time: new Date(Date.now() + 259200000).toISOString(),
    end_time: new Date(Date.now() + 262800000).toISOString(),
    capacity: 50,
    rsvp_count: 38,
  },
];

class TrainingSession {
  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM training_sessions ORDER BY start_time ASC');
      return res.rows;
    }
    return demoSessions;
  }

  static async findById(id) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM training_sessions WHERE id = $1', [id]);
      return res.rows[0];
    }
    return demoSessions.find(s => s.id === parseInt(id));
  }

  static async create(data) {
    const { title, description, category, meeting_link, start_time, end_time, capacity } = data;
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO training_sessions (title, description, category, meeting_link, start_time, end_time, capacity)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, category || 'Engineering', meeting_link, start_time, end_time, capacity || 30]
      );
      return res.rows[0];
    }

    const newSession = {
      id: demoSessions.length + 1,
      title,
      description,
      category: category || 'Engineering',
      trainer_name: 'Lead Instructor',
      meeting_link: meeting_link || 'https://meet.capacityconnect.com/live',
      start_time: start_time || new Date().toISOString(),
      end_time: end_time || new Date(Date.now() + 3600000).toISOString(),
      capacity: capacity || 30,
      rsvp_count: 0,
    };
    demoSessions.push(newSession);
    return newSession;
  }
}

module.exports = TrainingSession;
