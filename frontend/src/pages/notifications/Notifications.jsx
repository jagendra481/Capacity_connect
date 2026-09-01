import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import NotificationPanel from '../../components/notifications/NotificationPanel';
import Loader from '../../components/common/Loader';
import { Bell } from 'lucide-react';

export const Notifications = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    notificationService.getNotifications()
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifs();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifs();
  };

  if (loading) return <Loader size="large" message="Loading notifications..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Bell className="w-6 h-6 text-brand-400" />
          <span>System Notifications Center</span>
        </h1>
        <p className="text-sm text-slate-400">
          In-app alerts for assessment results, course recommendations, certificates, and workshop reminders
        </p>
      </div>

      <NotificationPanel
        notifications={data?.notifications || []}
        unreadCount={data?.unreadCount || 0}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
};

export default Notifications;
