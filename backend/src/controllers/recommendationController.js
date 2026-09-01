const recommendationService = require('../services/recommendationService');
const response = require('../utils/response');

const getMyRecommendations = async (req, res, next) => {
  try {
    const data = await recommendationService.getRecommendationsForUser(req.user.id);
    return response.success(res, data, 'Recommendations generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getLearningPaths = async (req, res, next) => {
  try {
    const data = await recommendationService.getLearningPaths();
    return response.success(res, data, 'Learning paths retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyRecommendations,
  getLearningPaths,
};
