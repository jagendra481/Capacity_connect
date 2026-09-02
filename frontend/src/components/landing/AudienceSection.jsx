import React from 'react';
import { Building2, Presentation, GraduationCap } from 'lucide-react';

export const AudienceSection = () => {
  const audiences = [
    {
      id: 'organizations',
      title: 'For Organizations',
      description: 'Build a future-ready workforce and gain visibility into organizational capability.',
      icon: Building2,
    },
    {
      id: 'trainers',
      title: 'For Trainers',
      description: 'Create impactful training programs, manage learning content and track trainee progress.',
      icon: Presentation,
    },
    {
      id: 'learners',
      title: 'For Learners',
      description: 'Learn, grow and achieve your development goals through personalized learning.',
      icon: GraduationCap,
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Built for Everyone in Your Organization
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Capacity Connect aligns leadership, instructors, and individual learners towards unified capability goals.
          </p>
        </div>

        {/* 3 Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AudienceSection;
