const db = require('../config/database');
const crypto = require('crypto');

const ISSUING_ORGANIZATION = 'Ministry of Earth Sciences - Capacity Connect';

class Certificate {
  static computeCanonicalHash({
    certificate_id,
    user_id,
    trainee_name,
    course_id,
    course_name,
    completion_date,
    issuing_organization = ISSUING_ORGANIZATION,
    version = '1.0',
  }) {
    const canonicalPayload = [
      certificate_id || '',
      user_id || '',
      (trainee_name || '').trim(),
      course_id || '',
      (course_name || '').trim(),
      completion_date || '',
      issuing_organization || ISSUING_ORGANIZATION,
      version || '1.0',
    ].join('|');

    return crypto.createHash('sha256').update(canonicalPayload, 'utf8').digest('hex');
  }

  static generateUniqueCertificateId() {
    return `MOES-2026-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  static async getByUserId(userId) {
    const numericUserId = parseInt(userId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name, u.email as user_email
         FROM certificates c
         JOIN users u ON c.user_id = u.id
         WHERE c.user_id = $1
         ORDER BY c.issued_date DESC`,
        [numericUserId]
      );
      return res.rows;
    }

    return (db.memoryStore.certificates || []).filter(c => c.user_id === numericUserId);
  }

  static async getAllCertificates() {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name, u.email as user_email,
                app_u.full_name as approved_by_name,
                rej_u.full_name as rejected_by_name,
                rev_u.full_name as revoked_by_name
         FROM certificates c
         JOIN users u ON c.user_id = u.id
         LEFT JOIN users app_u ON c.approved_by = app_u.id
         LEFT JOIN users rej_u ON c.rejected_by = rej_u.id
         LEFT JOIN users rev_u ON c.revoked_by = rev_u.id
         ORDER BY c.issued_date DESC`
      );
      return res.rows;
    }

    return (db.memoryStore.certificates || []).map(cert => {
      const user = (db.memoryStore.users || []).find(u => u.id === cert.user_id);
      const appUser = (db.memoryStore.users || []).find(u => u.id === cert.approved_by);
      const rejUser = (db.memoryStore.users || []).find(u => u.id === cert.rejected_by);
      const revUser = (db.memoryStore.users || []).find(u => u.id === cert.revoked_by);
      return {
        ...cert,
        user_name: cert.trainee_name_snapshot || user?.full_name || 'Trainee Learner',
        user_email: user?.email || '',
        approved_by_name: appUser?.full_name || null,
        rejected_by_name: rejUser?.full_name || null,
        revoked_by_name: revUser?.full_name || null,
      };
    });
  }

  static async findById(id) {
    const numericId = parseInt(id);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name, u.email as user_email
         FROM certificates c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = $1`,
        [numericId]
      );
      return res.rows[0];
    }

    return (db.memoryStore.certificates || []).find(c => c.id === numericId);
  }

  static async findByUserAndCourse(userId, courseId) {
    const numericUserId = parseInt(userId);
    const numericCourseId = parseInt(courseId);

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name
         FROM certificates c
         JOIN users u ON c.user_id = u.id
         WHERE c.user_id = $1 AND c.course_id = $2`,
        [numericUserId, numericCourseId]
      );
      return res.rows[0];
    }

    return (db.memoryStore.certificates || []).find(
      c => c.user_id === numericUserId && c.course_id === numericCourseId
    );
  }

  static async findByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanIdentifier = identifier.toString().trim();
    const upperIdentifier = cleanIdentifier.toUpperCase();

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT c.*, u.full_name as user_name, u.email as user_email,
                app_u.full_name as approved_by_name
         FROM certificates c
         JOIN users u ON c.user_id = u.id
         LEFT JOIN users app_u ON c.approved_by = app_u.id
         WHERE UPPER(c.certificate_id) = $1
            OR c.sha256_hash = $2
            OR UPPER(c.certificate_hash) = $1
            OR (c.id::text = $3)`,
        [upperIdentifier, cleanIdentifier.toLowerCase(), cleanIdentifier]
      );
      return res.rows[0];
    }

    return (db.memoryStore.certificates || []).find(
      c =>
        (c.certificate_id && c.certificate_id.toUpperCase() === upperIdentifier) ||
        (c.sha256_hash && c.sha256_hash.toLowerCase() === cleanIdentifier.toLowerCase()) ||
        (c.certificate_hash && c.certificate_hash.toUpperCase() === upperIdentifier) ||
        c.id === parseInt(cleanIdentifier)
    );
  }

  static async create({
    user_id,
    trainee_name = 'Trainee Learner',
    course_id = null,
    course_name = 'Specialized Training Program',
    assessment_id = null,
    title,
    issuing_organization = ISSUING_ORGANIZATION,
    status = 'pending_approval',
    metadata = {},
  }) {
    const certificate_id = this.generateUniqueCertificateId();
    const issued_date = new Date().toISOString();
    const completion_date = issued_date.split('T')[0];
    const certTitle = title || course_name;

    const sha256_hash = this.computeCanonicalHash({
      certificate_id,
      user_id,
      trainee_name,
      course_id,
      course_name: certTitle,
      completion_date,
      issuing_organization,
      version: '1.0',
    });

    const certificate_hash = certificate_id;
    const verification_url = `http://localhost:5173/certificates/verify/${certificate_id}`;

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO certificates (
          certificate_id, certificate_hash, user_id, course_id, assessment_id, title,
          trainee_name_snapshot, course_name_snapshot, issuing_organization, sha256_hash,
          status, issued_date, verification_url, verification_count, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, $14)
        RETURNING *`,
        [
          certificate_id,
          certificate_hash,
          parseInt(user_id),
          course_id ? parseInt(course_id) : null,
          assessment_id ? parseInt(assessment_id) : null,
          certTitle,
          trainee_name,
          certTitle,
          issuing_organization,
          sha256_hash,
          status,
          issued_date,
          verification_url,
          JSON.stringify(metadata),
        ]
      );

      const created = res.rows[0];
      await this.logAudit({
        certificate_id: created.id,
        action: 'GENERATED',
        performed_by: user_id,
        reason: 'Course completed. Certificate generated in pending approval status.',
        metadata: { certificate_id, sha256_hash },
      });
      return created;
    }

    if (!db.memoryStore.certificates) db.memoryStore.certificates = [];
    if (!db.memoryStore.certificateAuditLogs) db.memoryStore.certificateAuditLogs = [];

    const newCert = {
      id: db.memoryStore.certificates.length + 1,
      certificate_id,
      certificate_hash,
      user_id: parseInt(user_id),
      user_name: trainee_name,
      trainee_name_snapshot: trainee_name,
      course_id: course_id ? parseInt(course_id) : null,
      course_name_snapshot: certTitle,
      assessment_id: assessment_id ? parseInt(assessment_id) : null,
      title: certTitle,
      issuing_organization,
      sha256_hash,
      status,
      issued_date,
      completion_date,
      verification_url,
      verification_count: 0,
      metadata,
    };

    db.memoryStore.certificates.unshift(newCert);

    await this.logAudit({
      certificate_id: newCert.id,
      action: 'GENERATED',
      performed_by: user_id,
      reason: 'Course completed. Certificate generated in pending approval status.',
      metadata: { certificate_id, sha256_hash },
    });

    return newCert;
  }

  static async approve(id, adminId, reason = 'Course completion verified and approved by administrator') {
    const numericId = parseInt(id);
    const approved_at = new Date().toISOString();

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `UPDATE certificates
         SET status = 'approved', approved_by = $1, approved_at = $2,
             rejected_by = NULL, rejected_at = NULL, rejection_reason = NULL,
             revoked_by = NULL, revoked_at = NULL, revocation_reason = NULL
         WHERE id = $3
         RETURNING *`,
        [adminId, approved_at, numericId]
      );
      const updated = res.rows[0];
      if (updated) {
        await this.logAudit({
          certificate_id: numericId,
          action: 'APPROVED',
          performed_by: adminId,
          reason,
          metadata: { approved_at },
        });
      }
      return updated;
    }

    const cert = (db.memoryStore.certificates || []).find(c => c.id === numericId);
    if (cert) {
      cert.status = 'approved';
      cert.approved_by = adminId;
      cert.approved_at = approved_at;
      cert.rejected_by = null;
      cert.rejected_at = null;
      cert.rejection_reason = null;
      cert.revoked_by = null;
      cert.revoked_at = null;
      cert.revocation_reason = null;

      await this.logAudit({
        certificate_id: numericId,
        action: 'APPROVED',
        performed_by: adminId,
        reason,
        metadata: { approved_at },
      });
    }
    return cert;
  }

  static async reject(id, adminId, reason = 'Course completion criteria evaluation rejected by administrator') {
    const numericId = parseInt(id);
    const rejected_at = new Date().toISOString();

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `UPDATE certificates
         SET status = 'rejected', rejected_by = $1, rejected_at = $2, rejection_reason = $3
         WHERE id = $4
         RETURNING *`,
        [adminId, rejected_at, reason, numericId]
      );
      const updated = res.rows[0];
      if (updated) {
        await this.logAudit({
          certificate_id: numericId,
          action: 'REJECTED',
          performed_by: adminId,
          reason,
          metadata: { rejected_at },
        });
      }
      return updated;
    }

    const cert = (db.memoryStore.certificates || []).find(c => c.id === numericId);
    if (cert) {
      cert.status = 'rejected';
      cert.rejected_by = adminId;
      cert.rejected_at = rejected_at;
      cert.rejection_reason = reason;

      await this.logAudit({
        certificate_id: numericId,
        action: 'REJECTED',
        performed_by: adminId,
        reason,
        metadata: { rejected_at },
      });
    }
    return cert;
  }

  static async revoke(id, adminId, reason = 'Certificate revoked by administrator due to policy non-compliance') {
    const numericId = parseInt(id);
    const revoked_at = new Date().toISOString();

    if (db.getIsPgConnected()) {
      const res = await db.query(
        `UPDATE certificates
         SET status = 'revoked', revoked_by = $1, revoked_at = $2, revocation_reason = $3
         WHERE id = $4
         RETURNING *`,
        [adminId, revoked_at, reason, numericId]
      );
      const updated = res.rows[0];
      if (updated) {
        await this.logAudit({
          certificate_id: numericId,
          action: 'REVOKED',
          performed_by: adminId,
          reason,
          metadata: { revoked_at },
        });
      }
      return updated;
    }

    const cert = (db.memoryStore.certificates || []).find(c => c.id === numericId);
    if (cert) {
      cert.status = 'revoked';
      cert.revoked_by = adminId;
      cert.revoked_at = revoked_at;
      cert.revocation_reason = reason;

      await this.logAudit({
        certificate_id: numericId,
        action: 'REVOKED',
        performed_by: adminId,
        reason,
        metadata: { revoked_at },
      });
    }
    return cert;
  }

  static async recordVerification(id) {
    const numericId = parseInt(id);
    const verified_at = new Date().toISOString();

    if (db.getIsPgConnected()) {
      await db.query(
        `UPDATE certificates
         SET verification_count = COALESCE(verification_count, 0) + 1,
             last_verified_at = $1
         WHERE id = $2`,
        [verified_at, numericId]
      );
    } else {
      const cert = (db.memoryStore.certificates || []).find(c => c.id === numericId);
      if (cert) {
        cert.verification_count = (cert.verification_count || 0) + 1;
        cert.last_verified_at = verified_at;
      }
    }

    await this.logAudit({
      certificate_id: numericId,
      action: 'VERIFIED',
      performed_by: null,
      reason: 'Public verification check performed',
      metadata: { verified_at },
    });
  }

  static async logAudit({ certificate_id, action, performed_by = null, reason = '', metadata = {} }) {
    const numericCertId = parseInt(certificate_id);
    if (db.getIsPgConnected()) {
      try {
        await db.query(
          `INSERT INTO certificate_audit_logs (certificate_id, action, performed_by, reason, metadata, timestamp)
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
          [numericCertId, action, performed_by, reason, JSON.stringify(metadata)]
        );
      } catch (err) {
        // Table may not exist yet if migrations not applied
      }
      return;
    }

    if (!db.memoryStore.certificateAuditLogs) {
      db.memoryStore.certificateAuditLogs = [];
    }
    db.memoryStore.certificateAuditLogs.push({
      id: db.memoryStore.certificateAuditLogs.length + 1,
      certificate_id: numericCertId,
      action,
      performed_by,
      reason,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  static async getAuditTrail(certificateId) {
    const numericCertId = parseInt(certificateId);
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT a.*, u.full_name as performed_by_name, u.email as performed_by_email
         FROM certificate_audit_logs a
         LEFT JOIN users u ON a.performed_by = u.id
         WHERE a.certificate_id = $1
         ORDER BY a.timestamp ASC`,
        [numericCertId]
      );
      return res.rows;
    }

    return (db.memoryStore.certificateAuditLogs || [])
      .filter(a => a.certificate_id === numericCertId)
      .map(log => {
        const user = (db.memoryStore.users || []).find(u => u.id === log.performed_by);
        return {
          ...log,
          performed_by_name: user?.full_name || (log.action === 'VERIFIED' ? 'Public System' : 'System Agent'),
          performed_by_email: user?.email || '',
        };
      });
  }
}

module.exports = Certificate;
