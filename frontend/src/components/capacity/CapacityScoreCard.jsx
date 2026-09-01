import React from 'react';
import { Activity, ShieldCheck, Target } from 'lucide-react';
import CapacityRiskBadge from './CapacityRiskBadge';

export const CapacityScoreCard = ({ capacityScore = 74.5, skillReadiness = 82, riskLevel = 'MEDIUM_RISK' }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-brand-400" />
          <span>Capacity Score Summary</span>
        </h4>
        <CapacityRiskBadge level={riskLevel} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Org Capacity Score</span>
          <p className="text-3xl font-extrabold text-brand-400">{capacityScore}</p>
          <p className="text-[10px] text-slate-500">Scale 0 - 100</p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Skill Readiness Index</span>
          <p className="text-3xl font-extrabold text-purple-400">{skillReadiness}%</p>
          <p className="text-[10px] text-slate-500">Operational Target Met</p>
        </div>
      </div>
    </div>
  );
};

export default CapacityScoreCard;
