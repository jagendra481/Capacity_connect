const TrainingSession = require('../models/TrainingSession');
const SessionRSVP = require('../models/SessionRSVP');

class CalendarService {
  async getSessions() {
    return TrainingSession.getAll();
  }

  async getSessionById(id) {
    const session = await TrainingSession.findById(id);
    if (!session) {
      const err = new Error('Training session not found.');
      err.statusCode = 404;
      throw err;
    }
    return session;
  }

  async createSession(data) {
    return TrainingSession.create(data);
  }

  async toggleRSVP(sessionId, userId) {
    return SessionRSVP.toggleRSVP(sessionId, userId);
  }
}

module.exports = new CalendarService();
