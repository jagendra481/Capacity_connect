import React from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationPanel = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Bell className="w-4 h-4 text-brand-400" />
          <span>Recent Activity & Alerts</span>
        </h4>
        <span className="text-xs text-slate-500">{notifications.length} alerts</span>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 rounded-xl border transition-colors flex items-start justify-between ${
              n.read ? 'bg-slate-950/40 border-slate-800/60 text-slate-400' : 'bg-brand-950/30 border-brand-500/30 text-slate-200'
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-100">{n.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
            </div>
            {!n.read && (
              <button
                onClick={() => markAsRead(n.id)}
                className="p-1 text-brand-400 hover:bg-brand-500/10 rounded transition-colors"
                title="Mark as read"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
