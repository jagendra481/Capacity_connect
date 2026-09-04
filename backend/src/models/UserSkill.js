const db = require('../config/database');

class UserSkill {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT us.*, s.name as skill_name, s.category 
         FROM user_skills us 
         JOIN skills s ON us.skill_id = s.id 
         WHERE us.user_id = $1`,
        [userId]
      );
      return res.rows;
    }
    return db.memoryStore.userSkills.filter(skill => skill.user_id === parseInt(userId));
  }

  static async updateSkillLevel(userId, skillId, newLevel) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO user_skills (user_id, skill_id, current_level)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, skill_id) DO UPDATE SET current_level = $3
         RETURNING *`,
        [userId, skillId, newLevel]
      );
      return res.rows[0];
    }

    const numericUserId = parseInt(userId);
    const numericSkillId = parseInt(skillId);
    let skill = db.memoryStore.userSkills.find(
      entry => entry.user_id === numericUserId && entry.skill_id === numericSkillId
    );
    if (skill) {
      skill.current_level = newLevel;
    } else {
      skill = { user_id: numericUserId, skill_id: numericSkillId, current_level: newLevel };
      db.memoryStore.userSkills.push(skill);
    }
    return skill;
  }
}

module.exports = UserSkill;
