import React from 'react';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;

  const isCritical = recommendation.priority === 'CRITICAL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{recommendation.category}</span>
          <span
            className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${
              isCritical
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {recommendation.priority}
          </span>
        </div>
        <h4 className="text-base font-bold text-slate-100 mb-1">{recommendation.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{recommendation.reason}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-slate-500 flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{recommendation.duration}</span>
        </span>
        <Link
          to={`/trainee/courses`}
          className="inline-flex items-center space-x-1 font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          <span>Start Course</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RecommendationCard;
