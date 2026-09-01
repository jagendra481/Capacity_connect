import React from 'react';
import NotificationItem from './NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationPanel = ({ notifications = [], unreadCount = 0, onMarkRead, onMarkAllRead }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Bell className="w-4 h-4 text-brand-400" />
          <span>Notification Center ({unreadCount} Unread)</span>
        </h3>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-brand-400 hover:underline flex items-center space-x-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No new notifications</div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notif={n} onMarkRead={onMarkRead} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
