import React from 'react';
import { ClipboardCheck, Target, Sparkles, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Assess',
      description: 'Evaluate current skills and competencies through automated quizzes.',
      icon: ClipboardCheck,
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Identify Skill Gap',
      description: 'Discover the gap between current and required skills across roles.',
      icon: Target,
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Recommend',
      description: 'Get personalized training recommendations & career learning paths.',
      icon: Sparkles,
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Learn',
      description: 'Engage in video courses, AI assistant explanations, & resources.',
      icon: BookOpen,
      badge: 'Step 4',
    },
    {
      step: '05',
      title: 'Improve',
      description: 'Measure improvement, earn certs, & build organizational capacity.',
      icon: TrendingUp,
      badge: 'Step 5',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-900/80 border-y border-slate-800/80 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            A proven 5-step continuous capacity building lifecycle designed to take learners from initial assessment to verifiable organizational capability.
          </p>
        </div>

        {/* Desktop Horizontal Process Timeline (hidden on mobile, visible on lg) */}
        <div className="hidden lg:block relative">
          {/* Connecting Line behind steps */}
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 -translate-y-6 z-0 opacity-40" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center text-center space-y-4 group">
                  {/* Icon & Step Number Circle */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-xl group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300" />
                    </div>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-extrabold bg-cyan-500 text-slate-950 rounded-full shadow-md">
                      {item.step}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5 p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl w-full flex-1">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Vertical Process Timeline (visible on sm/md, hidden on lg) */}
        <div className="lg:hidden relative space-y-6 max-w-xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-gradient-to-b from-cyan-500 via-teal-400 to-emerald-400 opacity-40" />

          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative flex items-start space-x-4 pl-2">
                {/* Step Circle Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>

                {/* Card Content */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
