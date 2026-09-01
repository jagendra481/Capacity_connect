const Notification = require('../models/Notification');

class NotificationService {
  async getUserNotifications(userId) {
    const list = await Notification.getByUserId(userId);
    const unreadCount = list.filter(n => !n.read).length;
    return {
      unreadCount,
      notifications: list,
    };
  }

  async markAsRead(id, userId) {
    return Notification.markAsRead(id, userId);
  }

  async markAllAsRead(userId) {
    return Notification.markAllAsRead(userId);
  }

  async createNotification(data) {
    return Notification.create(data);
  }
}

module.exports = new NotificationService();
