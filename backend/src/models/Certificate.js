const db = require('../config/database');
const crypto = require('crypto');

const demoCertificates = [];

class Certificate {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name 
         FROM certificates c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.user_id = $1 ORDER BY c.issued_date DESC`,
        [userId]
      );
      return res.rows;
    }
    return demoCertificates.filter(c => c.user_id === parseInt(userId));
  }

  static async findByHash(hash) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name 
         FROM certificates c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.certificate_hash = $1`,
        [hash]
      );
      return res.rows[0];
    }
    return demoCertificates.find(c => c.certificate_hash === hash);
  }

  static async create({ user_id, user_name = 'Learner', course_id, assessment_id, title }) {
    const hash = `CC-CERT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const verificationUrl = `http://localhost:5173/certificates/verify/${hash}`;

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO certificates (certificate_hash, user_id, course_id, assessment_id, title, verification_url)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [hash, user_id, course_id || null, assessment_id || null, title, verificationUrl]
      );
      return res.rows[0];
    }

    const newCert = {
      id: demoCertificates.length + 1,
      certificate_hash: hash,
      user_id: parseInt(user_id),
      user_name,
      course_id: course_id ? parseInt(course_id) : null,
      assessment_id: assessment_id ? parseInt(assessment_id) : null,
      title,
      issued_date: new Date().toISOString(),
      verification_url: verificationUrl,
    };
    demoCertificates.unshift(newCert);
    return newCert;
  }
}

module.exports = Certificate;
