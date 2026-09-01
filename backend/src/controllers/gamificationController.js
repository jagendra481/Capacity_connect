const gamificationService = require('../services/gamificationService');
const response = require('../utils/response');

const getMyGamification = async (req, res, next) => {
  try {
    const data = await gamificationService.getUserGamificationData(req.user.id);
    return response.success(res, data, 'Gamification stats retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const individual = await gamificationService.getIndividualLeaderboard();
    const department = await gamificationService.getDepartmentLeaderboard();
    return response.success(res, { individual, department }, 'Leaderboards retrieved', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyGamification,
  getLeaderboard,
};
