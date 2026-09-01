const db = require('../config/database');

class User {
  static async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = String(email).trim().toLowerCase();

    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      return res.rows[0];
    }
    return db.memoryStore.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  }

  static async findByGoogleId(googleId) {
    if (!googleId) return null;
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
      return res.rows[0];
    }
    return db.memoryStore.users.find(u => u.google_id === googleId);
  }

  static async findById(id) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;

    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT id, email, role, department_id, full_name, status, google_id, created_at FROM users WHERE id = $1',
        [numericId]
      );
      return res.rows[0];
    }
    const u = db.memoryStore.users.find(u => u.id === numericId);
    if (!u) return null;
    const { password_hash, ...userWithoutPassword } = u;
    return userWithoutPassword;
  }

  static async create({ email, password_hash, role = 'trainee', department_id = 1, full_name, google_id = null }) {
    const cleanEmail = String(email).trim().toLowerCase();
    const deptId = parseInt(department_id) || 1;
    const cleanRole = role || 'trainee';

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO users (email, password_hash, role, department_id, full_name, google_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, role, department_id, full_name, status, google_id, created_at`,
        [cleanEmail, password_hash || 'GOOGLE_OAUTH_ACCOUNT', cleanRole, deptId, full_name, google_id]
      );
      const user = res.rows[0];

      try {
        await db.query(
          `INSERT INTO user_profiles (user_id, designation, bio, avatar_url, xp, streak_days, competency_score)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id) DO NOTHING`,
          [
            user.id,
            cleanRole.toUpperCase(),
            `New ${cleanRole} via Google Auth`,
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
            100,
            1,
            50
          ]
        );
      } catch (err) {
        console.warn('Profile insertion warning:', err.message);
      }

      return user;
    }

    const newId = db.memoryStore.users.length + 1;
    const newUser = {
      id: newId,
      email: cleanEmail,
      password_hash: password_hash || 'GOOGLE_OAUTH_ACCOUNT',
      role: cleanRole,
      department_id: deptId,
      full_name,
      status: 'active',
      google_id,
      created_at: new Date().toISOString()
    };
    db.memoryStore.users.push(newUser);

    db.memoryStore.userProfiles.push({
      user_id: newId,
      designation: cleanRole.toUpperCase(),
      bio: `New ${cleanRole} via Google Auth`,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
      xp: 100,
      streak_days: 1,
      competency_score: 50
    });

    const { password_hash: ph, ...userClean } = newUser;
    return userClean;
  }

  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT id, email, role, department_id, full_name, status, created_at FROM users ORDER BY id ASC');
      return res.rows;
    }
    return db.memoryStore.users.map(({ password_hash, ...u }) => u);
  }

  static async updateRole(userId, newRole) {
    const numericId = parseInt(userId);
    if (db.getIsPgConnected()) {
      const res = await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [newRole, numericId]);
      return res.rows[0];
    }
    const u = db.memoryStore.users.find(u => u.id === numericId);
    if (u) u.role = newRole;
    return u;
  }
}

module.exports = User;
