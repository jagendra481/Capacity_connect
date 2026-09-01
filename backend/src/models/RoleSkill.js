const db = require('../config/database');

const defaultRoleSkills = [
  { role: 'trainee', skill_id: 1, skill_name: 'React.js Architecture', required_level: 85 },
  { role: 'trainee', skill_id: 2, skill_name: 'Node.js Microservices', required_level: 80 },
  { role: 'trainee', skill_id: 3, skill_name: 'PostgreSQL Database Tuning', required_level: 75 },
  { role: 'trainee', skill_id: 4, skill_name: 'AI RAG & Embeddings', required_level: 90 },
  { role: 'trainee', skill_id: 5, skill_name: 'Cyber Security & DevSecOps', required_level: 70 },
];

class RoleSkill {
  static async getByRole(role = 'trainee') {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `SELECT rs.*, s.name as skill_name, s.category 
         FROM role_skills rs 
         JOIN skills s ON rs.skill_id = s.id 
         WHERE rs.role = $1`,
        [role]
      );
      return res.rows;
    }
    return defaultRoleSkills.filter(rs => rs.role === role);
  }
}

module.exports = RoleSkill;
