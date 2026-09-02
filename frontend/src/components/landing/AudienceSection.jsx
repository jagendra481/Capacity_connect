import React from 'react';
import { Building2, Presentation, GraduationCap, CheckCircle } from 'lucide-react';

export const AudienceSection = () => {
  const audiences = [
    {
      id: 'organizations',
      title: 'For Organizations',
      description:
        'Build a future-ready workforce and gain real-time visibility into organizational capability, skill gap distributions, and department readiness.',
      icon: Building2,
      tag: 'Leadership & HR',
      points: ['Organizational Capacity Radar', 'Department Benchmarking', 'Capacity Audit Exports'],
    },
    {
      id: 'trainers',
      title: 'For Trainers & Instructors',
      description:
        'Create impactful training programs, manage course content, author assessments, and track trainee progress across learning modules.',
      icon: Presentation,
      tag: 'L&D & Trainers',
      points: ['Course & Quiz Authoring', 'Live Workshop Webinars', 'Trainee Performance Analytics'],
    },
    {
      id: 'learners',
      title: 'For Learners & Trainees',
      description:
        'Learn, grow, and achieve your professional development goals through AI-recommended learning paths, instant feedback, and certified accomplishments.',
      icon: GraduationCap,
      tag: 'Employees & Students',
      points: ['AI RAG Learning Assistant', 'Gamified Badges & XP', 'Verifiable Digital Certificates'],
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
            Tailored Experience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            Built for Everyone in Your Organization
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            Whether you are an executive leader measuring enterprise readiness, an instructor designing coursework, or an employee building skills, Capacity Connect is tailored for you.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl hover:border-cyan-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="pt-4 space-y-2.5 border-t border-slate-800/80">
                    {item.points.map((pt, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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
