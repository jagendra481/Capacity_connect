const calendarService = require('../services/calendarService');
const response = require('../utils/response');

const getSessions = async (req, res, next) => {
  try {
    const data = await calendarService.getSessions();
    return response.success(res, data, 'Training sessions retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await calendarService.getSessionById(id);
    return response.success(res, data, 'Session details retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const data = await calendarService.createSession(req.body);
    return response.success(res, data, 'Training session created', 201);
  } catch (error) {
    next(error);
  }
};

const toggleRSVP = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await calendarService.toggleRSVP(id, req.user.id);
    return response.success(res, data, 'RSVP status updated', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  toggleRSVP,
};
