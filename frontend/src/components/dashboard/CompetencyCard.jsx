import React from 'react';
import { TrendingUp, Target } from 'lucide-react';

export const CompetencyCard = ({ score = 72 }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Competency Score</span>
        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-white">{score}</span>
        <span className="text-sm text-slate-400 font-medium">/ 100</span>
      </div>
      <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
        <Target className="w-3.5 h-3.5" />
        <span>Role Target: 85 (13pt gap)</span>
      </p>
    </div>
  );
};

export default CompetencyCard;
