import React from 'react';
import { Sparkles } from 'lucide-react';

export const ValueStatement = () => {
  return (
    <section className="py-10 bg-slate-900/40 border-y border-slate-800/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center space-x-3 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm max-w-3xl mx-auto">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <h2 className="text-sm sm:text-base font-semibold text-slate-200 tracking-tight">
            Empowering People. Strengthening Skills.{' '}
            <span className="text-cyan-400 font-bold">
              Building Stronger Organizations.
            </span>
          </h2>
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
};

export default ValueStatement;
