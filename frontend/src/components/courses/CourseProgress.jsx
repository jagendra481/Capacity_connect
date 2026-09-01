import React from 'react';
import { BookCheck } from 'lucide-react';

export const CourseProgress = ({ completedLessons = 2, totalLessons = 5 }) => {
  const percentage = Math.round((completedLessons / Math.max(totalLessons, 1)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
          <BookCheck className="w-4 h-4 text-brand-400" />
          <span>Course Completion</span>
        </span>
        <span className="font-bold text-brand-400">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-brand-600 to-cyan-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 text-right">
        {completedLessons} of {totalLessons} lessons completed
      </p>
    </div>
  );
};

export default CourseProgress;
