import React from 'react';
import { Zap, Award } from 'lucide-react';

export const XPCard = ({ totalXP = 450, level = 3 }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience Points</span>
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
          <Zap className="w-5 h-5 fill-amber-400" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-white">{totalXP}</span>
        <span className="text-sm text-amber-400 font-bold">XP</span>
      </div>
      <p className="text-xs text-slate-400 font-semibold">
        Level {level} Competency Associate
      </p>
    </div>
  );
};

export default XPCard;
