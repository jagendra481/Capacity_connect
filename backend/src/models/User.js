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
        'SELECT id, email, role, department_id, full_name, designation, employee_student_id, email_verified, profile_image, status, google_id, created_at, last_login_at FROM users WHERE id = $1',
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
    
    const allowedRoles = ['trainee', 'trainer', 'administrator', 'super_admin'];
    const cleanRole = allowedRoles.includes(role) ? role : 'trainee';
    const avatarUrl = profile_image || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(full_name || 'User'));

    if (db.getIsPgConnected()) {
      const res = await db.query(
        'INSERT INTO users (email, password_hash, role, department_id, full_name, designation, employee_student_id, email_verified, profile_image, google_id, status, last_login_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP) RETURNING id, email, role, department_id, full_name, designation, employee_student_id, email_verified, profile_image, status, google_id, created_at, last_login_at',
        [cleanEmail, password_hash || 'GOOGLE_OAUTH_ACCOUNT', cleanRole, deptId, full_name, designation, employee_student_id, email_verified, avatarUrl, google_id, 'active']
      );
      const user = res.rows[0];

      try {
        await db.query(
          'INSERT INTO user_profiles (user_id, designation, bio, avatar_url, xp, streak_days, competency_score) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id) DO NOTHING',
          [user.id, designation || cleanRole.toUpperCase(), 'New ' + cleanRole + ' member', avatarUrl, 0, 0, 0]
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
      designation,
      employee_student_id,
      email_verified,
      profile_image: avatarUrl,
      status: 'active',
      google_id,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    };

    db.memoryStore.users.push(newUser);
    db.memoryStore.userProfiles.push({
      user_id: newId,
      designation: designation || cleanRole.toUpperCase(),
      bio: 'New ' + cleanRole + ' member',
      avatar_url: avatarUrl,
      xp: 0,
      streak_days: 0,
      competency_score: 0,
    });

    if (db.saveMemoryStore) db.saveMemoryStore();

    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
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
    if (u) {
      u.email_verified = isVerified;
      if (db.saveMemoryStore) db.saveMemoryStore();
    }
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
      if (db.saveMemoryStore) db.saveMemoryStore();
    }
    return u;
  }

  static async updateLastLogin(userId) {
    const numericId = parseInt(userId);
    if (db.getIsPgConnected()) {
      await db.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [numericId]);
    } else {
      const u = db.memoryStore.users.find(u => u.id === numericId);
      if (u) {
        u.last_login_at = new Date().toISOString();
        u.last_login = new Date().toISOString();
        if (db.saveMemoryStore) db.saveMemoryStore();
      }
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
    if (u) {
      u.password_hash = passwordHash;
      if (db.saveMemoryStore) db.saveMemoryStore();
    }
    return u;
  }

  static async createByAdmin({
    email,
    password_hash,
    full_name,
    role = 'trainee',
    department_id = 1,
    designation = null,
    phone = null,
    organization = 'Ministry of Earth Sciences',
    qualifications = null,
    experience = null,
    skills = [],
    status = 'active',
  }) {
    const cleanEmail = String(email).trim().toLowerCase();
    const deptId = parseInt(department_id) || 1;
    const avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(full_name || 'User');

    if (db.getIsPgConnected()) {
      const res = await db.query(
        'INSERT INTO users (email, password_hash, role, department_id, full_name, designation, email_verified, profile_image, status, last_login_at) VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8, CURRENT_TIMESTAMP) RETURNING id, email, role, department_id, full_name, designation, email_verified, profile_image, status, created_at, last_login_at',
        [cleanEmail, password_hash, role, deptId, full_name, designation, avatarUrl, status]
      );
      const user = res.rows[0];

      await db.query(
        'INSERT INTO user_profiles (user_id, designation, bio, avatar_url, phone, organization, qualifications, experience, skills, xp, streak_days, competency_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0, 0) ON CONFLICT (user_id) DO UPDATE SET designation = EXCLUDED.designation, phone = EXCLUDED.phone, organization = EXCLUDED.organization, qualifications = EXCLUDED.qualifications, experience = EXCLUDED.experience, skills = EXCLUDED.skills',
        [user.id, designation || role.toUpperCase(), 'Member of ' + organization, avatarUrl, phone, organization, qualifications, experience, JSON.stringify(skills)]
      );

      return user;
    }

    const newId = db.memoryStore.users.length + 1;
    const newUser = {
      id: newId,
      email: cleanEmail,
      password_hash,
      role,
      department_id: deptId,
      full_name,
      designation,
      email_verified: true,
      profile_image: avatarUrl,
      status,
      created_at: new Date().toISOString(),
      last_login_at: null,
    };

    db.memoryStore.users.push(newUser);
    db.memoryStore.userProfiles.push({
      user_id: newId,
      designation: designation || role.toUpperCase(),
      bio: 'Member of ' + organization,
      avatar_url: avatarUrl,
      phone,
      organization,
      qualifications,
      experience,
      skills: Array.isArray(skills) ? skills : [],
      xp: 0,
      streak_days: 0,
      competency_score: 0,
    });

    if (db.saveMemoryStore) db.saveMemoryStore();

    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async getAllWithFilters({ search = '', role = '', status = '', department_id = null, limit = 100, offset = 0 } = {}) {
    if (db.getIsPgConnected()) {
      let queryStr = 'SELECT u.id, u.email, u.role, u.department_id, u.full_name, u.designation, u.email_verified, u.profile_image, u.status, u.created_at, u.last_login_at, d.name as department_name, up.phone, up.organization, up.xp, up.competency_score FROM users u LEFT JOIN departments d ON u.department_id = d.id LEFT JOIN user_profiles up ON u.id = up.user_id WHERE 1=1';
      const params = [];

      if (role) {
        if (role === 'admin' || role === 'administrator') {
          queryStr += " AND (u.role = 'administrator' OR u.role = 'super_admin')";
        } else {
          params.push(role);
          queryStr += ' AND u.role = $' + params.length;
        }
      }
      if (status) {
        params.push(status);
        queryStr += ' AND u.status = $' + params.length;
      }
      if (department_id) {
        params.push(parseInt(department_id));
        queryStr += ' AND u.department_id = $' + params.length;
      }
      if (search) {
        params.push('%' + search + '%');
        queryStr += ' AND (u.full_name ILIKE $' + params.length + ' OR u.email ILIKE $' + params.length + ' OR u.designation ILIKE $' + params.length + ')';
      }

      queryStr += ' ORDER BY u.id DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(parseInt(limit), parseInt(offset));

      const res = await db.query(queryStr, params);
      return res.rows;
    }

    let users = db.memoryStore.users || [];

    if (role) {
      if (role === 'admin' || role === 'administrator') {
        users = users.filter(u => u.role === 'administrator' || u.role === 'super_admin');
      } else {
        users = users.filter(u => u.role === role);
      }
    }
    if (status) {
      users = users.filter(u => (u.status || 'active') === status);
    }
    if (department_id) {
      users = users.filter(u => u.department_id === parseInt(department_id));
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.designation || '').toLowerCase().includes(q)
      );
    }

    return users.slice(offset, offset + limit).map(u => {
      const profile = (db.memoryStore.userProfiles || []).find(p => p.user_id === u.id) || {};
      const dept = (db.memoryStore.departments || []).find(d => d.id === u.department_id) || {};
      const certCount = (db.memoryStore.certificates || []).filter(c => c.user_id === u.id && c.status === 'approved').length;
      const progressCount = (db.memoryStore.courseProgress || []).filter(cp => cp.user_id === u.id).length;

      const { password_hash, ...safeUser } = u;
      return {
        ...safeUser,
        status: safeUser.status || 'active',
        department_name: dept.name || 'General Operations',
        phone: profile.phone || '+91 98765 43210',
        organization: profile.organization || 'Ministry of Earth Sciences',
        qualifications: profile.qualifications || 'B.Tech / M.Sc in Oceanography & Earth Sciences',
        experience: profile.experience || '4+ Years in Computational Research & Analysis',
        skills: profile.skills && profile.skills.length > 0 ? profile.skills : ['Geospatial Analysis', 'Ocean Data Modeling', 'Python', 'Radar Meteorology'],
        xp: profile.xp || 1250,
        competency_score: profile.competency_score || 88,
        certificates_count: certCount,
        courses_count: progressCount > 0 ? 2 : 1,
      };
    });
  }

  static async getAll() {
    return this.getAllWithFilters();
  }

  static async updateStatus(id, status, reason = null) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'UPDATE users SET status = $1, suspension_reason = $2 WHERE id = $3 RETURNING id, email, role, full_name, status, created_at',
        [status, reason, numericId]
      );
      return res.rows[0];
    }

    const user = db.memoryStore.users.find(u => u.id === numericId);
    if (user) {
      user.status = status;
      if (reason) user.suspension_reason = reason;
      if (db.saveMemoryStore) db.saveMemoryStore();
      const { password_hash, ...safe } = user;
      return safe;
    }
    return null;
  }

  static async updateRole(id, role) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role, full_name, status',
        [role, numericId]
      );
      return res.rows[0];
    }

    const user = db.memoryStore.users.find(u => u.id === numericId);
    if (user) {
      user.role = role;
      if (db.saveMemoryStore) db.saveMemoryStore();
      const { password_hash, ...safe } = user;
      return safe;
    }
    return null;
  }

  static async setPassword(id, password_hash) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, numericId]);
      return true;
    }
    const user = db.memoryStore.users.find(u => u.id === numericId);
    if (user) {
      user.password_hash = password_hash;
      if (db.saveMemoryStore) db.saveMemoryStore();
      return true;
    }
    return false;
  }

  static async getDetailedProfile(id) {
    const numericId = parseInt(id);
    const user = await this.findById(numericId);
    if (!user) return null;

    let profile = null;
    let department = null;
    let certificates = [];
    let enrollments = [];
    let assessmentAttempts = [];
    let auditLogs = [];

    if (db.getIsPgConnected()) {
      const pRes = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [numericId]);
      profile = pRes.rows[0] || {};

      const dRes = await db.query('SELECT * FROM departments WHERE id = $1', [user.department_id]);
      department = dRes.rows[0] || {};

      const cRes = await db.query('SELECT * FROM certificates WHERE user_id = $1 ORDER BY created_at DESC', [numericId]);
      certificates = cRes.rows;

      const aRes = await db.query(
        'SELECT aa.*, a.title as assessment_title, c.title as course_title FROM assessment_attempts aa LEFT JOIN assessments a ON aa.assessment_id = a.id LEFT JOIN courses c ON a.course_id = c.id WHERE aa.user_id = $1 ORDER BY aa.created_at DESC',
        [numericId]
      );
      assessmentAttempts = aRes.rows;

      const cpRes = await db.query(
        'SELECT cp.*, c.title as course_title, c.category, c.level FROM course_progress cp LEFT JOIN courses c ON cp.course_id = c.id WHERE cp.user_id = $1 ORDER BY cp.last_accessed DESC',
        [numericId]
      );
      enrollments = cpRes.rows;

      const logRes = await db.query(
        'SELECT * FROM admin_activity_logs WHERE target_id = $1 OR performed_by = $2 ORDER BY created_at DESC LIMIT 20',
        [String(numericId), numericId]
      );
      auditLogs = logRes.rows;
    } else {
      profile = (db.memoryStore.userProfiles || []).find(p => p.user_id === numericId) || {
        phone: '+91 98765 43210',
        organization: 'Ministry of Earth Sciences - INCOIS',
        qualifications: 'M.Sc Marine Sciences & AI Systems',
        experience: '5 Years Research Associate',
        skills: ['Ocean Data Processing', 'Satellite Remote Sensing', 'Python Machine Learning'],
        bio: 'Dedicated researcher contributing to national capacity building missions.',
        xp: 1450,
        competency_score: 92,
      };
      department = (db.memoryStore.departments || []).find(d => d.id === user.department_id) || { name: 'Ocean Sciences & Climate Modeling' };
      certificates = (db.memoryStore.certificates || []).filter(c => c.user_id === numericId);
      assessmentAttempts = (db.memoryStore.assessmentAttempts || []).filter(a => a.user_id === numericId);
      enrollments = [
        {
          course_id: 101,
          course_title: 'Modern React Architecture & Performance',
          progress_percentage: 100,
          status: 'completed',
          completed_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
        {
          course_id: 102,
          course_title: 'Node.js, Express & API Engineering',
          progress_percentage: 75,
          status: 'in_progress',
          last_accessed: new Date(Date.now() - 2 * 86400000).toISOString(),
        }
      ];
      auditLogs = (db.memoryStore.adminActivityLogs || []).filter(l => l.target_id === String(numericId) || l.performed_by === numericId);
    }

    return {
      ...user,
      profile,
      department,
      certificates,
      enrollments,
      assessmentAttempts,
      auditLogs,
    };
  }
}

module.exports = User;
