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
        `SELECT id, email, role, department_id, full_name, designation, employee_student_id, email_verified, profile_image, status, google_id, created_at, last_login 
         FROM users WHERE id = $1`,
        [numericId]
      );
      return res.rows[0];
    }
    const u = db.memoryStore.users.find(u => u.id === numericId);
    if (!u) return null;
    const { password_hash, ...userWithoutPassword } = u;
    return userWithoutPassword;
  }

  static async create({
    email,
    password_hash,
    role = 'trainee',
    department_id = 1,
    full_name,
    designation = null,
    employee_student_id = null,
    email_verified = false,
    google_id = null,
    profile_image = null,
  }) {
    const cleanEmail = String(email).trim().toLowerCase();
    const deptId = parseInt(department_id) || 1;
    
    // Enforce role security: Public creation cannot set 'administrator'
    const allowedRoles = ['trainee', 'trainer'];
    const cleanRole = allowedRoles.includes(role) ? role : 'trainee';

    const avatarUrl = profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name || 'User')}`;

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO users (email, password_hash, role, department_id, full_name, designation, employee_student_id, email_verified, profile_image, google_id, last_login)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
         RETURNING id, email, role, department_id, full_name, designation, employee_student_id, email_verified, profile_image, status, google_id, created_at, last_login`,
        [cleanEmail, password_hash || 'GOOGLE_OAUTH_ACCOUNT', cleanRole, deptId, full_name, designation, employee_student_id, email_verified, avatarUrl, google_id]
      );
      const user = res.rows[0];

      try {
        await db.query(
          `INSERT INTO user_profiles (user_id, designation, bio, avatar_url, xp, streak_days, competency_score)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id) DO NOTHING`,
          [
            user.id,
            designation || cleanRole.toUpperCase(),
            `New ${cleanRole} member`,
            avatarUrl,
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
      designation: designation || cleanRole.toUpperCase(),
      employee_student_id,
      email_verified: Boolean(email_verified),
      profile_image: avatarUrl,
      status: 'active',
      google_id,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
    db.memoryStore.users.push(newUser);

    db.memoryStore.userProfiles.push({
      user_id: newId,
      designation: designation || cleanRole.toUpperCase(),
      bio: `New ${cleanRole} member`,
      avatar_url: avatarUrl,
      xp: 100,
      streak_days: 1,
      competency_score: 50
    });

    const { password_hash: ph, ...userClean } = newUser;
    return userClean;
  }

  static async setEmailVerified(userId, isVerified = true) {
    const numericId = parseInt(userId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'UPDATE users SET email_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [isVerified, numericId]
      );
      return res.rows[0];
    }
    const u = db.memoryStore.users.find(u => u.id === numericId);
    if (u) u.email_verified = isVerified;
    return u;
  }

  static async linkGoogleAccount(userId, googleId) {
    const numericId = parseInt(userId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'UPDATE users SET google_id = $1, email_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [googleId, numericId]
      );
      return res.rows[0];
    }
    const u = db.memoryStore.users.find(u => u.id === numericId);
    if (u) {
      u.google_id = googleId;
      u.email_verified = true;
    }
    return u;
  }

  static async updateLastLogin(userId) {
    const numericId = parseInt(userId);
    if (db.getIsPgConnected()) {
      await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [numericId]);
    } else {
      const u = db.memoryStore.users.find(u => u.id === numericId);
      if (u) u.last_login = new Date().toISOString();
    }
  }

  static async updatePassword(userId, passwordHash) {
    const numericId = parseInt(userId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [passwordHash, numericId]
      );
      return res.rows[0];
    }
    const u = db.memoryStore.users.find(u => u.id === numericId);
    if (u) u.password_hash = passwordHash;
    return u;
  }

  static async getAll() {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'SELECT id, email, role, department_id, full_name, designation, email_verified, status, created_at FROM users ORDER BY id ASC'
      );
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
