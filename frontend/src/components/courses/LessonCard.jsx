import React from 'react';
import { PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LessonCard = ({ lesson, courseId }) => {
  if (!lesson) return null;

  return (
    <Link
      to={`/courses/${courseId}/lessons/${lesson.id}`}
      className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
        lesson.completed
          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200 hover:bg-emerald-950/40'
          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {lesson.completed ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <PlayCircle className="w-5 h-5 text-brand-400" />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-100">{lesson.title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{lesson.duration || '20 mins'}</p>
        </div>
      </div>

      {lesson.is_preview && (
        <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
          Preview Available
        </span>
      )}
    </Link>
  );
};

export default LessonCard;
