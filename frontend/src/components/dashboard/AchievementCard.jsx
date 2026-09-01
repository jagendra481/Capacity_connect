import React from 'react';
import { Award, Zap, CheckCircle2 } from 'lucide-react';

export const AchievementCard = ({ achievement }) => {
  if (!achievement) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3 shadow-md">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
        {achievement.icon === 'Zap' ? (
          <Zap className="w-5 h-5 fill-amber-400" />
        ) : achievement.icon === 'Award' ? (
          <Award className="w-5 h-5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        )}
      </div>
      <div>
        <h5 className="text-sm font-semibold text-slate-200">{achievement.title}</h5>
        <p className="text-xs text-slate-400">{achievement.description}</p>
      </div>
    </div>
  );
};

export default AchievementCard;
