import React from 'react';

export const SkillLevel = ({ level = 70 }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-24 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-brand-500 h-full rounded-full"
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-200">{level}%</span>
    </div>
  );
};

export default SkillLevel;
