import React from 'react';
import { Target, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const SkillGapCard = ({ gapItem }) => {
  if (!gapItem) return null;

  const { skill_name, category, required_level, current_level, gap, severity } = gapItem;

  const severityBadgeStyles = {
    'No Gap': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Low': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Medium': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Critical': 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{category}</span>
        <span className={`px-2.5 py-0.5 text-[10px] uppercase font-extrabold rounded-full border ${severityBadgeStyles[severity] || severityBadgeStyles.Low}`}>
          {severity} Severity
        </span>
      </div>

      <div>
        <h4 className="text-base font-bold text-slate-100">{skill_name}</h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Formula: Gap ({gap}pt) = Required ({required_level}) - Current ({current_level})
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Current Level</span>
          <span className="text-brand-400">{current_level} / 100</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-brand-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${current_level}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="text-slate-400">Target Role Level</span>
          <span className="text-purple-400">{required_level} / 100</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${required_level}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillGapCard;
