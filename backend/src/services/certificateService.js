const Certificate = require('../models/Certificate');
const User = require('../models/User');

class CertificateService {
  async getUserCertificates(userId) {
    return Certificate.getByUserId(userId);
  }

  async getAllCertificates() {
    return Certificate.getAllCertificates();
  }

  async updateCertificateStatus(id, status) {
    return Certificate.updateStatus(id, status);
  }

  async verifyCertificate(hash) {
    const cert = await Certificate.findByHash(hash);
    if (!cert) {
      return { verified: false, message: 'Certificate hash invalid or not found in registry.' };
    }
    return {
      verified: true,
      certificate: cert,
    };
  }

  async generateCertificate({ userId, courseId, assessmentId, title, status = 'pending' }) {
    const user = await User.findById(userId);
    return Certificate.create({
      user_id: userId,
      user_name: user?.full_name || 'Learner',
      course_id: courseId,
      assessment_id: assessmentId,
      title,
      status: status || 'pending',
    });
  }
}

module.exports = new CertificateService();
