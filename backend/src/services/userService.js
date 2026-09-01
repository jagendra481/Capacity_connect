const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Department = require('../models/Department');
const Competency = require('../models/Competency');
const Recommendation = require('../models/Recommendation');

class UserService {
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    const profile = await UserProfile.getByUserId(userId);
    const departments = await Department.getAll();
    const dept = departments.find(d => d.id === user.department_id);

    return {
      ...user,
      department_name: dept ? dept.name : 'General',
      profile,
    };
  }

  async updateUserProfile(userId, data) {
    const updatedProfile = await UserProfile.update(userId, data);
    return this.getUserProfile(userId);
  }

  async getAllUsers() {
    const users = await User.getAll();
    const departments = await Department.getAll();

    return Promise.all(
      users.map(async u => {
        const profile = await UserProfile.getByUserId(u.id);
        const dept = departments.find(d => d.id === u.department_id);
        return {
          ...u,
          department_name: dept ? dept.name : 'General',
          profile,
        };
      })
    );
  }

  async getTraineeDashboardData(userId) {
    const user = await this.getUserProfile(userId);
    const competencies = await Competency.getByUserId(userId);
    const recommendations = await Recommendation.getByUserId(userId);

    const pendingAssessments = [
      {
        id: 1,
        title: 'Full-Stack React & Node Mid-Term Assessment',
        questionsCount: 15,
        timeLimitMinutes: 30,
        due_date: '2026-09-10',
        difficulty: 'Intermediate',
      },
      {
        id: 2,
        title: 'PostgreSQL Query & Optimization Test',
        questionsCount: 10,
        timeLimitMinutes: 20,
        due_date: '2026-09-15',
        difficulty: 'Advanced',
      },
    ];

    const achievements = [
      { id: 1, title: 'Quick Starter', description: 'Completed 1st course lesson', icon: 'Zap' },
      { id: 2, title: 'Skill Champion', description: 'Achieved >70% competency', icon: 'Award' },
      { id: 3, title: '5-Day Streak', description: 'Maintained 5 consecutive study days', icon: 'CheckCircle' },
    ];

    const certificates = [
      {
        id: 'CERT-2026-8891',
        title: 'Full-Stack React Fundamentals',
        issued_date: '2026-08-20',
        verification_url: '/verify/certificate/CERT-2026-8891',
      },
      {
        id: 'CERT-2026-4412',
        title: 'Git Version Control Mastery',
        issued_date: '2026-07-14',
        verification_url: '/verify/certificate/CERT-2026-4412',
      },
    ];

    return {
      user,
      learningProgress: 68,
      competencyScore: user.profile?.competency_score || 72,
      learningStreak: user.profile?.streak_days || 5,
      xpPoints: user.profile?.xp || 450,
      competencies,
      recommendations,
      pendingAssessments,
      achievements,
      certificates,
      notificationsCount: 3,
    };
  }
}

module.exports = new UserService();
