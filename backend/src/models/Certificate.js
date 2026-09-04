const db = require('../config/database');
const crypto = require('crypto');

const demoCertificates = [
  {
    id: 1,
    certificate_hash: 'CC-CERT-7B9A2F1C3D8E',
    user_id: 1,
    user_name: 'Alex Johnson',
    course_id: 1,
    assessment_id: null,
    title: 'Full-Stack Enterprise Architecture & Microservices',
    issued_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: 'approved',
    verification_url: 'http://localhost:5173/certificates/verify/CC-CERT-7B9A2F1C3D8E',
  },
  {
    id: 2,
    certificate_hash: 'CC-CERT-4A2D8F9E1B5C',
    user_id: 1,
    user_name: 'Alex Johnson',
    course_id: 2,
    assessment_id: null,
    title: 'Data Science & Machine Learning Pipeline Engineering',
    issued_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'pending',
    verification_url: 'http://localhost:5173/certificates/verify/CC-CERT-4A2D8F9E1B5C',
  }
];

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

  static async getAllCertificates() {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name, u.email as user_email 
         FROM certificates c 
         JOIN users u ON c.user_id = u.id 
         ORDER BY c.issued_date DESC`
      );
      return res.rows;
    }
    return demoCertificates;
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

  static async updateStatus(id, status) {
    const validStatus = ['approved', 'pending', 'rejected'].includes(status) ? status : 'approved';

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `UPDATE certificates SET status = $1 WHERE id = $2 RETURNING *`,
        [validStatus, parseInt(id)]
      );
      return res.rows[0];
    }

    const cert = demoCertificates.find(c => c.id === parseInt(id));
    if (cert) {
      cert.status = validStatus;
    }
    return cert;
  }

  static async create({ user_id, user_name = 'Learner', course_id, assessment_id, title, status = 'pending' }) {
    const hash = `CC-CERT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    const verificationUrl = `http://localhost:5173/certificates/verify/${hash}`;
    const certStatus = ['approved', 'pending', 'rejected'].includes(status) ? status : 'pending';

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO certificates (certificate_hash, user_id, course_id, assessment_id, title, verification_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [hash, user_id, course_id || null, assessment_id || null, title, verificationUrl, certStatus]
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
      status: certStatus,
      issued_date: new Date().toISOString(),
      verification_url: verificationUrl,
    };
    demoCertificates.unshift(newCert);
    return newCert;
  }
}

module.exports = Certificate;
