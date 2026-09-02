import React from 'react';
import { Building2, Presentation, GraduationCap, Check } from 'lucide-react';

export const AudienceSection = () => {
  const audiences = [
    {
      id: 'organizations',
      title: 'For Organizations',
      description: 'Build a future-ready workforce and gain visibility into organizational capability.',
      icon: Building2,
      points: ['Capacity Radar analytics', 'Department readiness insights', 'Skill gap risk indicators'],
    },
    {
      id: 'trainers',
      title: 'For Trainers',
      description: 'Create impactful training programs, manage learning content and track trainee progress.',
      icon: Presentation,
      points: ['Course & quiz authoring', 'Trainee progress tracking', 'Live training sessions'],
    },
    {
      id: 'learners',
      title: 'For Learners',
      description: 'Learn, grow and achieve your development goals through personalized learning.',
      icon: GraduationCap,
      points: ['AI RAG study assistant', 'Custom learning paths', 'Verified digital certificates'],
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Tailored Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Built for Everyone in Your Organization
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Capacity Connect aligns leadership, instructors, and individual learners towards unified capability goals.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-md hover:border-slate-700 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.description}</p>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    {item.points.map((pt, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
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
