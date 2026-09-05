const db = require('../config/database');

class AdminActivityLog {
  static async log({ action, performed_by, performed_by_name, target_entity, target_id, details, ip_address, metadata = {} }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO admin_activity_logs (action, performed_by, performed_by_name, target_entity, target_id, details, ip_address, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [action, performed_by, performed_by_name, target_entity, target_id ? String(target_id) : null, details, ip_address, JSON.stringify(metadata)]
      );
      return res.rows[0];
    }

    if (!db.memoryStore.adminActivityLogs) {
      db.memoryStore.adminActivityLogs = [];
    }

    const logEntry = {
      id: db.memoryStore.adminActivityLogs.length + 1,
      action: action.toUpperCase(),
      performed_by: performed_by || null,
      performed_by_name: performed_by_name || 'System Admin',
      target_entity,
      target_id: target_id ? String(target_id) : null,
      details: details || '',
      ip_address: ip_address || '127.0.0.1',
      metadata,
      created_at: new Date().toISOString(),
    };

    db.memoryStore.adminActivityLogs.unshift(logEntry);
    return logEntry;
  }

  static async getAll({ search = '', action = '', actorId = null, targetEntity = '', limit = 100, offset = 0 } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = `SELECT aal.*, u.email as performed_by_email
                      FROM admin_activity_logs aal
                      LEFT JOIN users u ON aal.performed_by = u.id
                      WHERE 1=1`;
      const params = [];

      if (action) {
        params.push(action.toUpperCase());
        queryStr += ` AND aal.action = $${params.length}`;
      }
      if (actorId) {
        params.push(parseInt(actorId));
        queryStr += ` AND aal.performed_by = $${params.length}`;
      }
      if (targetEntity) {
        params.push(targetEntity);
        queryStr += ` AND aal.target_entity = $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        queryStr += ` AND (aal.details ILIKE $${params.length} OR aal.performed_by_name ILIKE $${params.length} OR aal.target_id ILIKE $${params.length})`;
      }

      queryStr += ` ORDER BY aal.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let logs = db.memoryStore.adminActivityLogs || [];

    if (action) {
      logs = logs.filter(l => l.action === action.toUpperCase());
    }
    if (actorId) {
      logs = logs.filter(l => l.performed_by === parseInt(actorId));
    }
    if (targetEntity) {
      logs = logs.filter(l => l.target_entity === targetEntity);
    }
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        (l.details || '').toLowerCase().includes(q) ||
        (l.performed_by_name || '').toLowerCase().includes(q) ||
        (l.target_id || '').toLowerCase().includes(q)
      );
    }

    return logs.slice(offset, offset + limit);
  }
}

module.exports = AdminActivityLog;
