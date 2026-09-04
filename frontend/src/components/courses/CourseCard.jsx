import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User, ArrowRight } from 'lucide-react';

export const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group">
      <div>
        <div className="relative h-44 overflow-hidden bg-slate-950">
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md bg-slate-900/80 backdrop-blur-md text-brand-400 border border-slate-700">
              {course.category}
            </span>
            <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
              {course.level}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-2">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>{course.completedLessons || 0} of {course.totalLessons || 0} lessons</span>
            <span className="text-brand-400">{course.progressPercentage || 0}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${course.progressPercentage || 0}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{course.duration || '6h 00m'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{course.trainer_name || 'Expert Trainer'}</span>
          </span>
        </div>

        <Link
          to={`/courses/${course.id}`}
          className="w-full py-2.5 bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
        >
          <span>View Course Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
