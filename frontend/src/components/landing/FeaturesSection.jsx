import React from 'react';
import { Target, BookOpen, BrainCircuit, Activity, ArrowUpRight } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      id: 'skill-gap',
      title: 'Skill Gap Analysis',
      description:
        'Identify individual and organizational skill gaps through automated assessments and multi-tier competency analysis.',
      icon: Target,
      color: 'from-cyan-500 to-blue-500',
      tag: 'Competency Engine',
    },
    {
      id: 'personalized-learning',
      title: 'Personalized Learning',
      description:
        'Get tailored courses, learning paths and interactive resources based on your role, current skills, and career goals.',
      icon: BookOpen,
      color: 'from-teal-500 to-emerald-500',
      tag: 'Adaptive Learning',
    },
    {
      id: 'ai-recommendations',
      title: 'AI-Powered Recommendations',
      description:
        'Receive intelligent training recommendations based on real-time competency gaps, quiz scores, and learning speed.',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-500',
      tag: 'RAG & AI Assistant',
    },
    {
      id: 'capacity-radar',
      title: 'Capacity Radar & Analytics',
      description:
        'Visualize organizational capability, identify critical skill gaps across departments, and track ROI improvement over time.',
      icon: Activity,
      color: 'from-amber-500 to-cyan-500',
      tag: 'Executive Radar USP',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            Enterprise Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Build Capability
          </h2>
          <p className="text-base sm:text-lg text-slate-400 font-normal">
            Capacity Connect combines skill assessment, personalized learning paths, AI-powered course recommendations, and multi-dimensional capacity radar analytics in a unified platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Ambient Glow on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl from-cyan-500 to-teal-400" />

                <div className="space-y-4">
                  {/* Icon Container */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/40 transition-all">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
