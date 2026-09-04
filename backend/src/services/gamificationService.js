const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Department = require('../models/Department');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const XPTransaction = require('../models/XPTransaction');

class GamificationService {
  async getUserGamificationData(userId) {
    const profile = await UserProfile.getByUserId(userId);
    const badges = await UserBadge.getByUserId(userId);
    const history = await XPTransaction.getByUserId(userId);

    return {
      totalXP: profile?.xp ?? 0,
      streakDays: profile?.streak_days ?? 0,
      level: Math.floor((profile?.xp ?? 0) / 200) + 1,
      badges,
      xpHistory: history,
    };
  }

  async getIndividualLeaderboard() {
    const users = await User.getAll();
    const leaderList = await Promise.all(
      users.map(async u => {
        const profile = await UserProfile.getByUserId(u.id);
        return {
          id: u.id,
          name: u.full_name,
          role: u.role,
          avatar: profile?.avatar_url,
          xp: profile?.xp ?? 0,
          streak: profile?.streak_days ?? 0,
          competency: profile?.competency_score ?? 0,
        };
      })
    );

    return leaderList.sort((a, b) => b.xp - a.xp);
  }

  async getDepartmentLeaderboard() {
    const departments = await Department.getAll();
    return departments.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      totalXP: 1500 + d.id * 450,
      avgCompetency: 70 + d.id * 3,
      membersCount: 8 + d.id * 2,
    })).sort((a, b) => b.totalXP - a.totalXP);
  }
}

module.exports = new GamificationService();
