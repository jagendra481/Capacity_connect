const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const db = require('../config/database');

class AdminService {
  async resetUserProgress(userId) {
    const numericId = parseInt(userId);
    if (isNaN(numericId)) {
      const err = new Error('Invalid user ID');
      err.statusCode = 400;
      throw err;
    }

    // Verify user exists
    const user = await User.findById(numericId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    await AssessmentAttempt.deleteByUserId(numericId);

    if (db.getIsPgConnected()) {
      // Reset all progress-related tables in PostgreSQL
      await db.query('DELETE FROM course_progress WHERE user_id = $1', [numericId]);
      await db.query('DELETE FROM user_skills WHERE user_id = $1', [numericId]);
      await db.query('DELETE FROM skill_gaps WHERE user_id = $1', [numericId]);
      await db.query('DELETE FROM user_badges WHERE user_id = $1', [numericId]);
      await db.query('DELETE FROM xp_transactions WHERE user_id = $1', [numericId]);
      await db.query('DELETE FROM certificates WHERE user_id = $1', [numericId]);

      // Reset profile scores back to defaults
      await db.query(
        `UPDATE user_profiles 
         SET xp = 0, streak_days = 0, competency_score = 0
         WHERE user_id = $1`,
        [numericId]
      );
    } else {
      // Reset in-memory store
      db.memoryStore.courseProgress = db.memoryStore.courseProgress.filter(p => p.user_id !== numericId);
      db.memoryStore.userSkills = db.memoryStore.userSkills.filter(s => s.user_id !== numericId);
      db.memoryStore.skillGaps = db.memoryStore.skillGaps.filter(g => g.user_id !== numericId);
      db.memoryStore.userBadges = db.memoryStore.userBadges.filter(b => b.user_id !== numericId);
      db.memoryStore.xpTransactions = db.memoryStore.xpTransactions.filter(x => x.user_id !== numericId);
      db.memoryStore.certificates = db.memoryStore.certificates.filter(c => c.user_id !== numericId);

      // Reset profile scores back to defaults
      const profile = db.memoryStore.userProfiles.find(p => p.user_id === numericId);
      if (profile) {
        profile.xp = 0;
        profile.streak_days = 0;
        profile.competency_score = 0;
      }
    }

    return { userId: numericId, fullName: user.full_name, resetAt: new Date().toISOString() };
  }

  async getOverviewStats() {
    const users = await User.getAll();
    const departments = await Department.getAll();
    const courses = await Course.getAll();
    const assessments = await Assessment.getAll();

    return {
      totalUsers: users.length,
      totalDepartments: departments.length,
      totalCourses: courses.length,
      totalAssessments: assessments.length,
      avgOrganizationalCompetency: 74.8,
      criticalGapsCount: 4,
      monthlyActiveLearners: 128,
    };
  }

  async getAllUsers() {
    return User.getAll();
  }

  async updateUserRole(userId, newRole) {
    return User.updateRole(userId, newRole);
  }

  async getAllDepartments() {
    return Department.getAll();
  }

  async createDepartment(data) {
    return Department.create(data);
  }

  async getAnalyticsData() {
    const departments = await Department.getAll();
    return {
      skillGapDistribution: [
        { severity: 'No Gap', count: 140 },
        { severity: 'Low', count: 85 },
        { severity: 'Medium', count: 42 },
        { severity: 'Critical', count: 18 },
      ],
      departmentBenchmark: departments.map(d => ({
        name: d.code,
        current: 65 + d.id * 4,
        required: 85,
      })),
    };
  }

  async generateCapacityReport() {
    return {
      generatedAt: new Date().toISOString(),
      reportTitle: 'Organizational Capacity & Competency Audit Report',
      summary: 'Executive overview of skill gap distributions and training impact across all enterprise departments.',
      exportStatus: 'READY',
      downloadUrl: '/api/admin/reports/capacity-audit.pdf',
    };
  }
}

module.exports = new AdminService();
