import React from 'react';
import { ShieldAlert, Zap, Layers, Sparkles } from 'lucide-react';

export const ValueStatement = () => {
  return (
    <section className="py-12 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-xl max-w-4xl mx-auto">
          <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <h2 className="text-base sm:text-xl font-extrabold text-slate-100 tracking-tight">
            "Empowering People. Strengthening Skills.{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Building Stronger Organizations.
            </span>
            "
          </h2>
          <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
};

export default ValueStatement;
