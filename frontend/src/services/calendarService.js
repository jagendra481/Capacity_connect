import api from './api';

export const calendarService = {
  getSessions: async () => {
    return api.get('/calendar');
  },

  getSessionById: async (id) => {
    return api.get(`/calendar/${id}`);
  },

  createSession: async (data) => {
    return api.post('/calendar', data);
  },

  toggleRSVP: async (id) => {
    return api.post(`/calendar/${id}/rsvp`);
  },
};

export default calendarService;
