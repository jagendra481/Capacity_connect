import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationBadge = ({ count = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors focus:outline-none"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border border-slate-950 shadow-md">
          {count}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;
