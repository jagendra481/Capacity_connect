const db = require('../config/database');

const defaultUserSkills = {
  1: [
    { user_id: 1, skill_id: 1, skill_name: 'React.js Architecture', current_level: 75 },
    { user_id: 1, skill_id: 2, skill_name: 'Node.js Microservices', current_level: 65 },
    { user_id: 1, skill_id: 3, skill_name: 'PostgreSQL Database Tuning', current_level: 80 },
    { user_id: 1, skill_id: 4, skill_name: 'AI RAG & Embeddings', current_level: 55 },
    { user_id: 1, skill_id: 5, skill_name: 'Cyber Security & DevSecOps', current_level: 60 },
  ],
};

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
    return defaultUserSkills[parseInt(userId)] || defaultUserSkills[1];
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

    const list = defaultUserSkills[parseInt(userId)] || defaultUserSkills[1];
    const skill = list.find(s => s.skill_id === parseInt(skillId));
    if (skill) {
      skill.current_level = newLevel;
    }
    return skill;
  }
}

module.exports = UserSkill;
