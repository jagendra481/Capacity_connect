import React from 'react';
import { BookOpen } from 'lucide-react';

export const SourceReference = ({ sources = [] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-purple-300 space-y-1">
      <div className="font-bold flex items-center gap-1.5 text-purple-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Verified Course References</span>
      </div>
      {sources.map((s, idx) => (
        <div key={idx} className="text-slate-400 pl-4 border-l border-purple-500/30">
          <span className="text-slate-300 font-semibold">{s.courseTitle}</span> — {s.source}
        </div>
      ))}
    </div>
  );
};

export default SourceReference;
