import React from 'react';
import { ClipboardCheck, Target, Sparkles, BookOpen, TrendingUp } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Assess',
      description: 'Evaluate current skills and competencies.',
      icon: ClipboardCheck,
    },
    {
      num: '02',
      title: 'Identify Skill Gap',
      description: 'Discover the gap between current and required skills.',
      icon: Target,
    },
    {
      num: '03',
      title: 'Recommend',
      description: 'Get personalized training and learning paths.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Learn',
      description: 'Engage in courses, resources and skill development.',
      icon: BookOpen,
    },
    {
      num: '05',
      title: 'Improve',
      description: 'Measure improvement and build organizational capability.',
      icon: TrendingUp,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            A structured framework from initial evaluation to measurable organizational capability.
          </p>
        </div>

        {/* Desktop Minimal Horizontal Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-6 left-10 right-10 h-px bg-slate-800 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{step.num}</span>
                    <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Vertical Timeline */}
        <div className="lg:hidden relative space-y-6 max-w-md mx-auto">
          <div className="absolute top-4 bottom-4 left-5 w-px bg-slate-800" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex items-start space-x-4 pl-1">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center z-10 flex-shrink-0">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
                    <span className="text-[10px] font-mono text-slate-500">{step.num}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{step.description}</p>
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
