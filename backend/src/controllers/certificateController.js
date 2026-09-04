const certificateService = require('../services/certificateService');
const response = require('../utils/response');

const getMyCertificates = async (req, res, next) => {
  try {
    const data = await certificateService.getUserCertificates(req.user.id);
    return response.success(res, data, 'Certificates retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getAllCertificates = async (req, res, next) => {
  try {
    const data = await certificateService.getAllCertificates();
    return response.success(res, data, 'All system certificates retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const claimCertificate = async (req, res, next) => {
  try {
    const { courseId, assessmentId, title } = req.body;
    if (!courseId) {
      return response.error(res, 'Course ID is required to claim certificate', 400);
    }
    const result = await certificateService.claimCertificate({
      userId: req.user.id,
      courseId,
      assessmentId,
      title,
    });
    return response.success(res, result.certificate, result.message, 201);
  } catch (error) {
    next(error);
  }
};

const checkEligibility = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const result = await certificateService.checkEligibility(req.user.id, courseId);
    return response.success(res, result, 'Eligibility evaluation completed', 200);
  } catch (error) {
    next(error);
  }
};

const approveCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const data = await certificateService.approveCertificate(id, req.user.id, reason);
    return response.success(res, data, 'Certificate approved and verified successfully', 200);
  } catch (error) {
    next(error);
  }
};

const rejectCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const data = await certificateService.rejectCertificate(id, req.user.id, reason);
    return response.success(res, data, 'Certificate request rejected', 200);
  } catch (error) {
    next(error);
  }
};

const revokeCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const data = await certificateService.revokeCertificate(id, req.user.id, reason);
    return response.success(res, data, 'Certificate revoked successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getCertificateAuditTrail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await certificateService.getCertificateAuditTrail(id);
    return response.success(res, data, 'Certificate audit trail retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const identifier = req.params.identifier || req.params.hash || req.query.id;
    const data = await certificateService.verifyCertificate(identifier);
    return response.success(res, data, 'Certificate verification completed', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCertificates,
  getAllCertificates,
  claimCertificate,
  checkEligibility,
  approveCertificate,
  rejectCertificate,
  revokeCertificate,
  getCertificateAuditTrail,
  verifyCertificate,
};
