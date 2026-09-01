const db = require('../config/database');
const TrainingSession = require('./TrainingSession');

class SessionRSVP {
  static async toggleRSVP(sessionId, userId) {
    if (db.getIsPgConnected()) {
      const check = await db.query('SELECT * FROM session_rsvps WHERE session_id = $1 AND user_id = $2', [sessionId, userId]);
      if (check.rows.length > 0) {
        await db.query('DELETE FROM session_rsvps WHERE session_id = $1 AND user_id = $2', [sessionId, userId]);
        return { rsvped: false };
      } else {
        await db.query('INSERT INTO session_rsvps (session_id, user_id) VALUES ($1, $2)', [sessionId, userId]);
        return { rsvped: true };
      }
    }

    const session = await TrainingSession.findById(sessionId);
    if (session) {
      session.rsvp_count += 1;
    }
    return { rsvped: true };
  }
}

module.exports = SessionRSVP;
