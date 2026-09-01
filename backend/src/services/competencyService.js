const Department = require('../models/Department');
const Skill = require('../models/Skill');
const SkillGap = require('../models/SkillGap');

class CompetencyService {
  async getCompetencyMatrix() {
    const departments = await Department.getAll();
    const skills = await Skill.getAll();

    const heatmap = departments.map((dept) => {
      const deptSkills = skills.map((skill) => {
        // Deterministic baseline competency data for matrix display
        const required = 80;
        const current = 60 + ((dept.id * 5 + skill.id * 7) % 35);
        const { gap, severity } = SkillGap.calculateGap(required, current);

        return {
          skill_id: skill.id,
          skill_name: skill.name,
          required_level: required,
          current_level: current,
          gap,
          severity,
        };
      });

      const avgCurrent = Math.round(deptSkills.reduce((acc, s) => acc + s.current_level, 0) / deptSkills.length);
      const avgRequired = Math.round(deptSkills.reduce((acc, s) => acc + s.required_level, 0) / deptSkills.length);

      return {
        department_id: dept.id,
        department_name: dept.name,
        department_code: dept.code,
        avgCurrent,
        avgRequired,
        avgGap: avgRequired - avgCurrent,
        skills: deptSkills,
      };
    });

    return {
      departmentsCount: departments.length,
      heatmap,
    };
  }
}

module.exports = new CompetencyService();
