import React, { useEffect, useState } from 'react';
import LessonCard from './LessonCard';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';

export const ModuleList = ({ modules = [], courseId }) => {
  const [openModules, setOpenModules] = useState(() => modules[0] ? [modules[0].id] : []);

  useEffect(() => {
    setOpenModules(modules[0] ? [modules[0].id] : []);
  }, [modules]);

  const toggleModule = (id) => {
    setOpenModules(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {modules.map((mod) => {
        const isOpen = openModules.includes(mod.id);
        return (
          <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full p-4 flex items-center justify-between bg-slate-900 hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{mod.title}</h4>
                  <p className="text-xs text-slate-400">{mod.description}</p>
                </div>
              </div>
              <div className="text-slate-400">
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </button>

            {isOpen && (
              <div className="p-4 pt-0 border-t border-slate-800/60 space-y-2 bg-slate-950/40">
                {(mod.lessons || []).map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} courseId={courseId} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModuleList;
