const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');

class TrainerService {
  async getTrainerTrainees(trainerId) {
    const users = await User.getAll();
    const trainees = users.filter(u => u.role === 'trainee');

    const traineesWithStats = await Promise.all(
      trainees.map(async (t) => {
        const profile = await UserProfile.getByUserId(t.id);
        return {
          id: t.id,
          name: t.full_name,
          email: t.email,
          role: t.role,
          competencyScore: profile?.competency_score ?? 0,
          completedCourses: 2,
          activeAssessments: 1,
          status: 'Active',
        };
      })
    );

    return traineesWithStats;
  }

  async getTrainerCourses(trainerId) {
    return Course.getAll();
  }

  async createCourse(courseData) {
    return Course.create(courseData);
  }

  async createAssessment(assessmentData) {
    return Assessment.create(assessmentData);
  }
}

module.exports = new TrainerService();
