import React from 'react';
import { Award, Sparkles, Calendar, Bell, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export const NotificationItem = ({ notif, onMarkRead }) => {
  if (!notif) return null;

  const icons = {
    Certificate: <Award className="w-4 h-4 text-amber-400" />,
    Recommendation: <Sparkles className="w-4 h-4 text-brand-400" />,
    Workshop: <Calendar className="w-4 h-4 text-purple-400" />,
    System: <Bell className="w-4 h-4 text-slate-400" />,
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start justify-between space-x-3 transition-colors ${
      notif.read ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-900 border-slate-700 text-slate-100 shadow-md'
    }`}>
      <div className="flex items-start space-x-3 flex-1">
        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex-shrink-0 mt-0.5">
          {icons[notif.type] || icons.System}
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold text-slate-200">{notif.title}</h4>
            {!notif.read && (
              <span className="w-2 h-2 rounded-full bg-brand-500" />
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
            <span>{formatDate(notif.created_at)}</span>
            {notif.link && (
              <Link to={notif.link} className="text-brand-400 font-semibold hover:underline">
                View →
              </Link>
            )}
          </div>
        </div>
      </div>

      {!notif.read && (
        <button
          onClick={() => onMarkRead(notif.id)}
          className="text-slate-500 hover:text-slate-200 text-[10px] font-bold underline"
        >
          Mark Read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
