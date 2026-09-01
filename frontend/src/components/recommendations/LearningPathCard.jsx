import React from 'react';
import { Route, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearningPathCard = ({ path }) => {
  if (!path) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
          <Route className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{path.title}</h3>
          <p className="text-xs text-slate-400">{path.description}</p>
        </div>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-slate-800">
        {(path.steps || []).map((s) => (
          <div key={s.step} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center border border-purple-500/30">
                {s.step}
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-200">{s.title}</p>
                <p className="text-[10px] text-slate-500">Duration: {s.duration}</p>
              </div>
            </div>
            <Link
              to={`/courses/${s.course_id}`}
              className="text-xs font-semibold text-purple-400 hover:underline"
            >
              Start →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathCard;
