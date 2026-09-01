import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const StreakCard = ({ streakDays = 5 }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Continuous Study Streak</span>
        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
          <Calendar className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-white">{streakDays}</span>
        <span className="text-sm text-slate-400 font-medium">Days Active</span>
      </div>
      <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Daily learning goal active!</span>
      </p>
    </div>
  );
};

export default StreakCard;
