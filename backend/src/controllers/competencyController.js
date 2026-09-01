const competencyService = require('../services/competencyService');
const response = require('../utils/response');

const getCompetencyMatrix = async (req, res, next) => {
  try {
    const data = await competencyService.getCompetencyMatrix();
    return response.success(res, data, 'Competency matrix heatmap retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompetencyMatrix,
};
