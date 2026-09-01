import React from 'react';
import { Target } from 'lucide-react';

export const SkillCard = ({ skill }) => {
  if (!skill) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-slate-800 text-slate-300 rounded">
        {skill.category}
      </span>
      <h4 className="text-base font-bold text-slate-100">{skill.name}</h4>
      <p className="text-xs text-slate-400">{skill.description}</p>
    </div>
  );
};

export default SkillCard;
