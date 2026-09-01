import React from 'react';
import { Award, Zap, CheckCircle2, Star } from 'lucide-react';

export const BadgeCard = ({ badge }) => {
  if (!badge) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start space-x-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-md">
        {badge.icon === 'Zap' ? (
          <Zap className="w-6 h-6 fill-amber-400" />
        ) : badge.icon === 'Star' ? (
          <Star className="w-6 h-6 fill-amber-400" />
        ) : (
          <Award className="w-6 h-6" />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-bold text-slate-100">{badge.name}</h4>
          <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
            +{badge.xp_bonus || 100} XP
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
        {badge.earned_at && (
          <p className="text-[10px] text-slate-500 pt-1">Earned on: {new Date(badge.earned_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
