const db = require('../config/database');

class Announcement {
  static async getAll({ status = '', audience = '', search = '', limit = 50, offset = 0 } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = `SELECT a.*, u.full_name as created_by_name
                      FROM announcements a
                      LEFT JOIN users u ON a.created_by = u.id
                      WHERE 1=1`;
      const params = [];

      if (status) {
        params.push(status);
        queryStr += ` AND a.status = $${params.length}`;
      }
      if (audience && audience !== 'all') {
        params.push(audience);
        queryStr += ` AND (a.target_audience = 'all' OR a.target_audience = $${params.length})`;
      }
      if (search) {
        params.push(`%${search}%`);
        queryStr += ` AND (a.title ILIKE $${params.length} OR a.content ILIKE $${params.length})`;
      }

      queryStr += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let announcements = db.memoryStore.announcements || [];

    if (status) {
      announcements = announcements.filter(a => a.status === status);
    }
    if (audience && audience !== 'all') {
      announcements = announcements.filter(a => a.target_audience === 'all' || a.target_audience === audience);
    }
    if (search) {
      const q = search.toLowerCase();
      announcements = announcements.filter(a =>
        a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
      );
    }

    return announcements.slice(offset, offset + limit);
  }

  static async findById(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM announcements WHERE id = $1', [numericId]);
      return res.rows[0];
    }
    return (db.memoryStore.announcements || []).find(a => a.id === numericId);
  }

  static async create({ title, content, category = 'General', target_audience = 'all', priority = 'normal', status = 'published', expires_at = null, created_by = null, metadata = {} }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO announcements (title, content, category, target_audience, priority, status, expires_at, created_by, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [title, content, category, target_audience, priority, status, expires_at, created_by, JSON.stringify(metadata)]
      );
      return res.rows[0];
    }

    if (!db.memoryStore.announcements) db.memoryStore.announcements = [];
    const item = {
      id: db.memoryStore.announcements.length + 1,
      title,
      content,
      category,
      target_audience,
      priority,
      status,
      published_at: new Date().toISOString(),
      expires_at,
      created_by,
      metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.memoryStore.announcements.unshift(item);
    return item;
  }

  static async update(id, updates) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const fields = [];
      const values = [];
      let index = 1;

      for (const [key, val] of Object.entries(updates)) {
        fields.push(`${key} = $${index}`);
        values.push(val);
        index++;
      }
      fields.push(`updated_at = $${index}`);
      values.push(new Date().toISOString());
      values.push(numericId);

      const res = await db.query(
        `UPDATE announcements SET ${fields.join(', ')} WHERE id = $${index + 1} RETURNING *`,
        values
      );
      return res.rows[0];
    }

    const item = (db.memoryStore.announcements || []).find(a => a.id === numericId);
    if (item) {
      Object.assign(item, updates, { updated_at: new Date().toISOString() });
      return item;
    }
    return null;
  }

  static async delete(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      await db.query('DELETE FROM announcements WHERE id = $1', [numericId]);
      return true;
    }
    const idx = (db.memoryStore.announcements || []).findIndex(a => a.id === numericId);
    if (idx !== -1) {
      db.memoryStore.announcements.splice(idx, 1);
      return true;
    }
    return false;
  }
}

module.exports = Announcement;
