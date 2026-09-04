const db = require('../config/database');

class SkillGap {
  static classifySeverity(gap) {
    if (gap <= 0) return 'No Gap';
    if (gap <= 15) return 'Low';
    if (gap <= 30) return 'Medium';
    return 'Critical';
  }

  static calculateGap(requiredLevel, currentLevel) {
    const gap = requiredLevel - currentLevel;
    return {
      gap,
      severity: this.classifySeverity(gap),
    };
  }

  static async getGapsForUser(userId, roleSkills = [], userSkills = []) {
    const gapAnalysis = roleSkills.map((rs) => {
      const us = userSkills.find(s => s.skill_id === rs.skill_id) || { current_level: 0 };
      const currentLevel = us.current_level;
      const requiredLevel = rs.required_level;
      const { gap, severity } = this.calculateGap(requiredLevel, currentLevel);

      return {
        skill_id: rs.skill_id,
        skill_name: rs.skill_name || `Skill #${rs.skill_id}`,
        category: rs.category || 'Engineering',
        required_level: requiredLevel,
        current_level: currentLevel,
        gap,
        severity,
      };
    });

    return gapAnalysis;
  }
}

module.exports = SkillGap;
