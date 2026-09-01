import React from 'react';
import { BookOpen } from 'lucide-react';

export const ProgressCard = ({ progress = 68 }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Learning Progress</span>
        <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-100">{progress}%</span>
        <span className="text-xs text-brand-400 font-medium">8/12 Modules Done</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-brand-600 to-cyan-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressCard;
