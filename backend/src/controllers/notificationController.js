const notificationService = require('../services/notificationService');
const response = require('../utils/response');

const getMyNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getUserNotifications(req.user.id);
    return response.success(res, data, 'Notifications retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await notificationService.markAsRead(id, req.user.id);
    return response.success(res, data, 'Notification marked as read', 200);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const data = await notificationService.markAllAsRead(req.user.id);
    return response.success(res, data, 'All notifications marked as read', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
