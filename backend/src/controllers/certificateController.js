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

const verifyCertificate = async (req, res, next) => {
  try {
    const { hash } = req.params;
    const data = await certificateService.verifyCertificate(hash);
    return response.success(res, data, 'Certificate verification completed', 200);
  } catch (error) {
    next(error);
  }
};

const generateCertificate = async (req, res, next) => {
  try {
    const { courseId, assessmentId, title } = req.body;
    const data = await certificateService.generateCertificate({
      userId: req.user.id,
      courseId,
      assessmentId,
      title,
    });
    return response.success(res, data, 'Certificate generated', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCertificates,
  verifyCertificate,
  generateCertificate,
};
