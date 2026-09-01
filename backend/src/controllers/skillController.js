const skillGapService = require('../services/skillGapService');
const response = require('../utils/response');

const getMySkillGap = async (req, res, next) => {
  try {
    const data = await skillGapService.getIndividualSkillGap(req.user.id);
    return response.success(res, data, 'Skill gap analysis retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getAllSkills = async (req, res, next) => {
  try {
    const data = await skillGapService.getAllSkills();
    return response.success(res, data, 'All skills retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMySkillGap,
  getAllSkills,
};
