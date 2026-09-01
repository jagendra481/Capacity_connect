import React from 'react';
import { FileText, Download } from 'lucide-react';

export const ResourceCard = ({ title = 'Resource Attachment', type = 'PDF', size = '1.2 MB' }) => {
  return (
    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FileText className="w-5 h-5 text-brand-400" />
        <div>
          <p className="text-xs font-semibold text-slate-200">{title}</p>
          <p className="text-[10px] text-slate-500">{type} • {size}</p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-white transition-colors">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ResourceCard;
