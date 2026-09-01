const db = require('../config/database');

const defaultOrganizationalRadar = [
  { dimension: 'Technical Competency', current: 78, required: 85, fullMark: 100 },
  { dimension: 'Process Maturity', current: 72, required: 80, fullMark: 100 },
  { dimension: 'Tool Proficiency', current: 82, required: 85, fullMark: 100 },
  { dimension: 'Domain Knowledge', current: 85, required: 90, fullMark: 100 },
  { dimension: 'Innovation & AI Readiness', current: 62, required: 85, fullMark: 100 },
  { dimension: 'Leadership & Mentorship', current: 68, required: 75, fullMark: 100 },
];

class CapacityRadar {
  static async getOrganizationalRadar() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM capacity_radar_metrics WHERE department_id IS NULL');
      if (res.rows.length > 0) return res.rows[0];
    }
    return {
      capacityScore: 74.5,
      skillReadinessIndex: 82.0,
      riskLevel: 'MEDIUM_RISK',
      dimensions: defaultOrganizationalRadar,
      improvementTimeline: [
        { month: 'Jan', score: 62 },
        { month: 'Feb', score: 65 },
        { month: 'Mar', score: 68 },
        { month: 'Apr', score: 71 },
        { month: 'May', score: 74.5 },
      ],
    };
  }

  static async getDepartmentRadar(departmentId) {
    return {
      departmentId,
      capacityScore: 78.0,
      riskLevel: 'LOW_RISK',
      dimensions: defaultOrganizationalRadar.map(d => ({
        ...d,
        current: Math.min(100, d.current + 5),
      })),
    };
  }
}

module.exports = CapacityRadar;
