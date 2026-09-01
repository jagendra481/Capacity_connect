const Recommendation = require('../models/Recommendation');
const LearningPath = require('../models/LearningPath');
const skillGapService = require('./skillGapService');

class RecommendationService {
  async getRecommendationsForUser(userId) {
    // Dynamically calculate gaps
    const gapAnalysis = await skillGapService.getIndividualSkillGap(userId);
    const storedRecs = await Recommendation.getByUserId(userId);

    return {
      userId,
      userRole: gapAnalysis.userRole,
      criticalGapsCount: gapAnalysis.criticalGapsCount,
      recommendations: storedRecs,
    };
  }

  async getLearningPaths() {
    return LearningPath.getAll();
  }
}

module.exports = new RecommendationService();
