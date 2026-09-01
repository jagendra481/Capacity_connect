const User = require('../models/User');
const Skill = require('../models/Skill');
const RoleSkill = require('../models/RoleSkill');
const UserSkill = require('../models/UserSkill');
const SkillGap = require('../models/SkillGap');

class SkillGapService {
  async getIndividualSkillGap(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const roleSkills = await RoleSkill.getByRole(user.role || 'trainee');
    const userSkills = await UserSkill.getByUserId(userId);
    const gaps = await SkillGap.getGapsForUser(userId, roleSkills, userSkills);

    const criticalCount = gaps.filter(g => g.severity === 'Critical').length;
    const mediumCount = gaps.filter(g => g.severity === 'Medium').length;
    const lowCount = gaps.filter(g => g.severity === 'Low').length;

    return {
      userId,
      userRole: user.role,
      userName: user.full_name,
      totalSkillsAssessed: gaps.length,
      criticalGapsCount: criticalCount,
      mediumGapsCount: mediumCount,
      lowGapsCount: lowCount,
      gaps,
    };
  }

  async getAllSkills() {
    return Skill.getAll();
  }
}

module.exports = new SkillGapService();
