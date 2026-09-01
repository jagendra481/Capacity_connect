const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');

class AdminService {
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
