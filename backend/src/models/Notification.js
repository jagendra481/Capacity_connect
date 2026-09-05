const db = require('../config/database');

const demoNotifications = [
  {
    id: 1,
    user_id: 1,
    title: 'Certificate Issued',
    message: 'Congratulations! You earned the Full-Stack React & Node Technical Certification.',
    type: 'Certificate',
    read: false,
    link: '/certificates',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'New Course Recommendation',
    message: 'AI Learning Engine recommends "Enterprise AI RAG Architecture" to close your critical AI gap.',
    type: 'Recommendation',
    read: false,
    link: '/trainee/recommendations',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Upcoming Workshop Reminder',
    message: 'Live session "Enterprise React 19 & Concurrent Rendering" starts tomorrow at 10:00 AM.',
    type: 'Workshop',
    read: true,
    link: '/calendar',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

class Notification {
  static async getByUserId(userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return res.rows;
    }
    return demoNotifications.filter(n => n.user_id === parseInt(userId));
  }

  static async markAsRead(id, userId) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        'UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, userId]
      );
      return res.rows[0];
    }
    const notif = demoNotifications.find(n => n.id === parseInt(id));
    if (notif) notif.read = true;
    return notif;
  }

  static async markAllAsRead(userId) {
    if (db.getIsPgConnected()) {
      await db.query('UPDATE notifications SET read = TRUE WHERE user_id = $1', [userId]);
      return { success: true };
    }
    demoNotifications.forEach(n => {
      if (n.user_id === parseInt(userId)) n.read = true;
    });
    return { success: true };
  }

  static async create({ user_id, title, message, type = 'System', link = '' }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, title, message, type, link]
      );
      return res.rows[0];
    }

    const newNotif = {
      id: demoNotifications.length + 1,
      user_id: parseInt(user_id),
      title,
      message,
      type,
      read: false,
      link,
      created_at: new Date().toISOString(),
    };
    demoNotifications.unshift(newNotif);
    return newNotif;
  }

  static async createAnnouncement({ title, message, type = 'Announcement', link = '' }) {
    if (db.getIsPgConnected()) {
      const res = await db.query(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES (0, $1, $2, $3, $4) RETURNING *`,
        [title, message, type, link]
      );
      return res.rows[0];
    }

    const newAnnouncement = {
      id: demoNotifications.length + 100,
      user_id: 0,
      title,
      message,
      type,
      read: false,
      link: link || '/',
      created_at: new Date().toISOString(),
    };
    demoNotifications.unshift(newAnnouncement);
    return newAnnouncement;
  }


  static async getPublicAnnouncements() {
    if (db.getIsPgConnected()) {
      const res = await db.query('SELECT * FROM notifications WHERE user_id = 0 ORDER BY created_at DESC');
      return res.rows;
    }
    return demoNotifications.filter(n => n.user_id === 0 || n.type === 'Announcement' || n.type === 'Achievement');
  }
}

module.exports = Notification;
