const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', authenticate, calendarController.getSessions);
router.get('/:id', authenticate, calendarController.getSessionById);
router.post('/', authenticate, requireRole(['trainer', 'administrator']), calendarController.createSession);
router.post('/:id/rsvp', authenticate, calendarController.toggleRSVP);

module.exports = router;
