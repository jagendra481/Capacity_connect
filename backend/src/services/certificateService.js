const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const CourseModule = require('../models/CourseModule');

class CertificateService {
  async getUserCertificates(userId) {
    return Certificate.getByUserId(userId);
  }

  async getAllCertificates() {
    return Certificate.getAllCertificates();
  }

  async getCertificateByIdentifier(identifier) {
    return Certificate.findByIdentifier(identifier);
  }

  async getCertificateAuditTrail(certificateId) {
    return Certificate.getAuditTrail(certificateId);
  }

  async approveCertificate(id, adminId, reason) {
    const cert = await Certificate.findById(id);
    if (!cert) {
      const err = new Error('Certificate not found.');
      err.statusCode = 404;
      throw err;
    }
    return Certificate.approve(id, adminId, reason || 'Course completion verified and approved by administrator');
  }

  async rejectCertificate(id, adminId, reason) {
    const cert = await Certificate.findById(id);
    if (!cert) {
      const err = new Error('Certificate not found.');
      err.statusCode = 404;
      throw err;
    }
    return Certificate.reject(id, adminId, reason || 'Course completion criteria evaluation rejected by administrator');
  }

  async revokeCertificate(id, adminId, reason) {
    const cert = await Certificate.findById(id);
    if (!cert) {
      const err = new Error('Certificate not found.');
      err.statusCode = 404;
      throw err;
    }
    return Certificate.revoke(id, adminId, reason || 'Certificate revoked by administrator due to compliance review');
  }

  async verifyCertificate(identifier) {
    if (!identifier) {
      return {
        verified: false,
        status: 'not_found',
        message: 'Certificate identifier is required.',
      };
    }

    const cert = await Certificate.findByIdentifier(identifier);
    if (!cert) {
      return {
        verified: false,
        status: 'not_found',
        message: 'Certificate not found. The provided ID or SHA-256 hash does not exist in the official registry.',
      };
    }

    // Recalculate canonical hash from snapshot
    const completionDate = cert.completion_date || (cert.issued_date ? cert.issued_date.split('T')[0] : '');
    const calculatedHash = Certificate.computeCanonicalHash({
      certificate_id: cert.certificate_id,
      user_id: cert.user_id,
      trainee_name: cert.trainee_name_snapshot || cert.user_name,
      course_id: cert.course_id,
      course_name: cert.course_name_snapshot || cert.title,
      completion_date: completionDate,
      issuing_organization: cert.issuing_organization || 'Ministry of Earth Sciences - Capacity Connect',
      version: '1.0',
    });

    const isTampered = cert.sha256_hash && calculatedHash !== cert.sha256_hash;

    // Record verification access
    await Certificate.recordVerification(cert.id);

    if (isTampered) {
      return {
        verified: false,
        status: 'tampered',
        is_tampered: true,
        message: 'CRITICAL SECURITY ALERT: Certificate data integrity check failed. The cryptographic hash does not match canonical snapshot data.',
        certificate: {
          certificate_id: cert.certificate_id,
          title: cert.title,
          issuing_organization: cert.issuing_organization,
          stored_hash: cert.sha256_hash,
          computed_hash: calculatedHash,
          status: 'tampered',
        },
      };
    }

    // Public sanitized payload
    const publicCert = {
      id: cert.id,
      certificate_id: cert.certificate_id,
      certificate_hash: cert.certificate_hash,
      sha256_hash: cert.sha256_hash,
      title: cert.title,
      course_name: cert.course_name_snapshot || cert.title,
      trainee_name: cert.trainee_name_snapshot || cert.user_name,
      issuing_organization: cert.issuing_organization || 'Ministry of Earth Sciences - Capacity Connect',
      issued_date: cert.issued_date,
      completion_date: completionDate,
      status: cert.status || 'pending_approval',
      approved_at: cert.approved_at,
      approved_by_name: cert.approved_by_name,
      rejection_reason: cert.status === 'rejected' ? cert.rejection_reason : undefined,
      revocation_reason: cert.status === 'revoked' ? cert.revocation_reason : undefined,
      verification_count: (cert.verification_count || 0) + 1,
      last_verified_at: new Date().toISOString(),
      verification_url: cert.verification_url || `http://localhost:5173/certificates/verify/${cert.certificate_id}`,
      metadata: cert.metadata || {},
    };

    if (cert.status === 'approved') {
      return {
        verified: true,
        status: 'approved',
        is_tampered: false,
        message: 'Certificate officially verified and authentic. Signed by Ministry of Earth Sciences Capacity Connect.',
        certificate: publicCert,
      };
    }

    if (cert.status === 'pending_approval' || cert.status === 'pending') {
      return {
        verified: false,
        status: 'pending_approval',
        is_tampered: false,
        message: 'Certificate is currently Pending Admin Approval. It has not yet been officially verified.',
        certificate: publicCert,
      };
    }

    if (cert.status === 'rejected') {
      return {
        verified: false,
        status: 'rejected',
        is_tampered: false,
        message: `Certificate has been rejected by administration.${cert.rejection_reason ? ' Reason: ' + cert.rejection_reason : ''}`,
        certificate: publicCert,
      };
    }

    if (cert.status === 'revoked') {
      return {
        verified: false,
        status: 'revoked',
        is_tampered: false,
        message: `Certificate has been REVOKED and is no longer valid.${cert.revocation_reason ? ' Reason: ' + cert.revocation_reason : ''}`,
        certificate: publicCert,
      };
    }

    return {
      verified: false,
      status: cert.status,
      is_tampered: false,
      message: `Certificate status: ${cert.status}`,
      certificate: publicCert,
    };
  }

  async checkEligibility(userId, courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      return { eligible: false, reason: 'Course does not exist.' };
    }

    const modules = await CourseModule.getByCourseId(courseId);
    const lessons = modules.flatMap(m => m.lessons || []);
    const progress = await CourseProgress.getByUserAndCourse(userId, courseId);
    const completedLessonIds = progress.filter(p => p.completed).map(p => p.lesson_id);
    const completedCount = lessons.filter(l => completedLessonIds.includes(l.id)).length;
    const totalCount = lessons.length;
    const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    if (progressPercentage < 100) {
      return {
        eligible: false,
        progressPercentage,
        completedCount,
        totalCount,
        reason: `Course is ${progressPercentage}% completed. You must complete 100% of lessons to be eligible for certification.`,
      };
    }

    return {
      eligible: true,
      progressPercentage: 100,
      completedCount,
      totalCount,
      course,
    };
  }

  async claimCertificate({ userId, courseId, assessmentId, title }) {
    const numericUserId = parseInt(userId);
    const numericCourseId = parseInt(courseId);

    // 1. Check if certificate already exists
    const existing = await Certificate.findByUserAndCourse(numericUserId, numericCourseId);
    if (existing) {
      return {
        isNew: false,
        certificate: existing,
        message: `Certificate already exists for this course (Status: ${existing.status}).`,
      };
    }

    // 2. Check eligibility (100% completion)
    const eligibility = await this.checkEligibility(numericUserId, numericCourseId);
    if (!eligibility.eligible) {
      const err = new Error(eligibility.reason);
      err.statusCode = 400;
      throw err;
    }

    // 3. Generate certificate in pending_approval status
    const user = await User.findById(numericUserId);
    const traineeName = user?.full_name || 'Trainee Learner';
    const courseName = eligibility.course?.title || title || 'Specialized Training Program';

    const cert = await Certificate.create({
      user_id: numericUserId,
      trainee_name: traineeName,
      course_id: numericCourseId,
      course_name: courseName,
      assessment_id: assessmentId || null,
      title: courseName,
      status: 'pending_approval',
      issuing_organization: 'Ministry of Earth Sciences - Capacity Connect',
      metadata: {
        category: eligibility.course?.category || 'General',
        level: eligibility.course?.level || 'Intermediate',
      },
    });

    return {
      isNew: true,
      certificate: cert,
      message: 'Certificate request submitted successfully and queued for Admin approval.',
    };
  }

  async generatePendingCertificateIfEligible(userId, courseId) {
    try {
      const existing = await Certificate.findByUserAndCourse(userId, courseId);
      if (existing) return existing;

      const eligibility = await this.checkEligibility(userId, courseId);
      if (!eligibility.eligible) return null;

      const user = await User.findById(userId);
      const traineeName = user?.full_name || 'Trainee Learner';
      const courseName = eligibility.course?.title || 'Specialized Training Program';

      return Certificate.create({
        user_id: userId,
        trainee_name: traineeName,
        course_id: courseId,
        course_name: courseName,
        title: courseName,
        status: 'pending_approval',
        issuing_organization: 'Ministry of Earth Sciences - Capacity Connect',
      });
    } catch (err) {
      return null;
    }
  }
}

module.exports = new CertificateService();
