const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Answer = require('../models/Answer');
const UserProfile = require('../models/UserProfile');

class AssessmentService {
  async getAllAssessments() {
    return Assessment.getAll();
  }

  async getAssessmentById(id) {
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      const err = new Error('Assessment not found.');
      err.statusCode = 404;
      throw err;
    }
    const questions = await Question.getByAssessmentId(id);
    return {
      ...assessment,
      questions,
    };
  }

  async createAssessment(data) {
    return Assessment.create(data);
  }

  async addQuestion(questionData) {
    return Question.create(questionData);
  }

  async submitAssessment(userId, assessmentId, userAnswers) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      const err = new Error('Assessment not found.');
      err.statusCode = 404;
      throw err;
    }

    const questions = await Question.getByAssessmentId(assessmentId);
    const evaluation = Answer.evaluate(userAnswers, questions);

    const passed = evaluation.score >= (assessment.passing_score || 70);

    const attempt = await AssessmentAttempt.create({
      user_id: userId,
      assessment_id: assessmentId,
      score: evaluation.score,
      passed,
      total_questions: evaluation.totalQuestions,
      correct_count: evaluation.correctCount,
      answers: evaluation.itemResults,
    });

    // Update user profile competency score with assessment result
    const currentProfile = await UserProfile.getByUserId(userId);
    if (currentProfile) {
      const newCompetencyScore = Math.round(((currentProfile.competency_score ?? 0) + evaluation.score) / 2);
      await UserProfile.update(userId, {
        competency_score: newCompetencyScore,
        xp: (currentProfile.xp ?? 0) + (passed ? 150 : 50),
      });
    }

    return {
      attemptId: attempt.id,
      assessmentTitle: assessment.title,
      score: evaluation.score,
      passingScore: assessment.passing_score,
      passed,
      correctCount: evaluation.correctCount,
      totalQuestions: evaluation.totalQuestions,
      results: evaluation.itemResults,
    };
  }

  async getUserHistory(userId) {
    return AssessmentAttempt.getByUserId(userId);
  }
}

module.exports = new AssessmentService();
