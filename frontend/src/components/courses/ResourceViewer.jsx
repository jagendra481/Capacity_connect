import React from 'react';
import { FileText, Download, Video, FileCode } from 'lucide-react';

export const ResourceViewer = ({ resources = [] }) => {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
        <FileText className="w-4 h-4 text-cyan-400" />
        <span>Lesson Resources & Activity Files</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((r) => (
          <div key={r.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                {r.type === 'PDF' ? <FileText className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">{r.title}</p>
                <span className="text-[10px] text-slate-500 uppercase font-bold">{r.type}</span>
              </div>
            </div>
            <a
              href={r.file_url || '#'}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Download Resource"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceViewer;
