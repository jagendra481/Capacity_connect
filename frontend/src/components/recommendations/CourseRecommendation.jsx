import React from 'react';
import PriorityBadge from './PriorityBadge';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CourseRecommendation = ({ item }) => {
  if (!item) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
          <PriorityBadge priority={item.priority} />
        </div>

        <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
        
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
          <p className="text-[11px] font-semibold text-brand-400 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommendation Rationale:</span>
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-slate-400 flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{item.duration || '6h 00m'}</span>
        </span>
        <Link
          to={`/courses/${item.course_id}`}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center space-x-1.5"
        >
          <span>Enroll & Start</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CourseRecommendation;
