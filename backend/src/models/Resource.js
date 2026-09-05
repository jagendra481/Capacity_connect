const db = require('../config/database');

class Resource {
  static async getAll({ courseId = null, trainerId = null, resourceType = '', search = '', status = 'active' } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = `SELECT r.*, c.title as course_title, u.full_name as trainer_name
                      FROM learning_resources r
                      LEFT JOIN courses c ON r.course_id = c.id
                      LEFT JOIN users u ON r.trainer_id = u.id
                      WHERE 1=1`;
      const params = [];

      if (courseId) {
        params.push(parseInt(courseId));
        queryStr += ` AND r.course_id = $${params.length}`;
      }
      if (trainerId) {
        params.push(parseInt(trainerId));
        queryStr += ` AND r.trainer_id = $${params.length}`;
      }
      if (resourceType) {
        params.push(resourceType);
        queryStr += ` AND r.resource_type = $${params.length}`;
      }
      if (status) {
        params.push(status);
        queryStr += ` AND r.status = $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        queryStr += ` AND (r.title ILIKE $${params.length} OR r.description ILIKE $${params.length})`;
      }

      queryStr += ' ORDER BY r.created_at DESC';
      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let items = db.memoryStore.learningResources || db.memoryStore.resources || [];
    if (courseId) items = items.filter(r => r.course_id === parseInt(courseId));
    if (trainerId) items = items.filter(r => r.trainer_id === parseInt(trainerId));
    if (resourceType) items = items.filter(r => r.resource_type === resourceType);
    if (status) items = items.filter(r => (r.status || 'active') === status);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => (r.title || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
    }
    return items;
  }

  static async findById(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM learning_resources WHERE id = $1', [numericId]);
      return res.rows[0];
    }
    const items = db.memoryStore.learningResources || db.memoryStore.resources || [];
    return items.find(r => r.id === numericId);
  }

  static async create({ title, description, resource_type, file_url, course_id, trainer_id, file_size_bytes = 0, duration_minutes = 0, status = 'active', created_by = null }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO learning_resources (title, description, resource_type, file_url, course_id, trainer_id, file_size_bytes, duration_minutes, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [title, description, resource_type, file_url, course_id, trainer_id, file_size_bytes, duration_minutes, status, created_by]
      );
      return res.rows[0];
    }

    if (!db.memoryStore.learningResources) db.memoryStore.learningResources = [];
    const item = {
      id: db.memoryStore.learningResources.length + 1,
      title,
      description,
      resource_type,
      file_url,
      course_id: course_id ? parseInt(course_id) : null,
      trainer_id: trainer_id ? parseInt(trainer_id) : null,
      file_size_bytes,
      duration_minutes,
      status,
      created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.memoryStore.learningResources.unshift(item);
    return item;
  }

  static async update(id, updates) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const fields = [];
      const values = [];
      let idx = 1;
      for (const [k, v] of Object.entries(updates)) {
        fields.push(`${k} = $${idx}`);
        values.push(v);
        idx++;
      }
      fields.push(`updated_at = $${idx}`);
      values.push(new Date().toISOString());
      values.push(numericId);

      const res = await db.query(
        `UPDATE learning_resources SET ${fields.join(', ')} WHERE id = $${idx + 1} RETURNING *`,
        values
      );
      return res.rows[0];
    }

    const items = db.memoryStore.learningResources || db.memoryStore.resources || [];
    const item = items.find(r => r.id === numericId);
    if (item) {
      Object.assign(item, updates, { updated_at: new Date().toISOString() });
      return item;
    }
    return null;
  }

  static async delete(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      await db.query('DELETE FROM learning_resources WHERE id = $1', [numericId]);
      return true;
    }
    const items = db.memoryStore.learningResources || db.memoryStore.resources || [];
    const idx = items.findIndex(r => r.id === numericId);
    if (idx !== -1) {
      items.splice(idx, 1);
      return true;
    }
    return false;
  }
}

module.exports = Resource;
