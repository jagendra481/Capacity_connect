import React, { useState } from 'react';
import { Target, BookOpen, BrainCircuit, Activity, ArrowUpRight } from 'lucide-react';

const FeatureCard = ({ item }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const Icon = item.icon;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 8, rotateY: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      style={{ perspective: '600px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${tilt.rotateX !== 0 ? '-4px' : '0px'})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-slate-700 transition-shadow duration-300 flex flex-col justify-between h-full"
      >
        <div className="space-y-4">
          {/* Subtle Icon Container */}
          <div className="flex items-center justify-between">
            <div
              style={{ transform: 'translateZ(15px)' }}
              className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors shadow-inner"
            >
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              {item.tag}
            </span>
          </div>

          {/* Title & Description */}
          <div style={{ transform: 'translateZ(10px)' }} className="space-y-2">
            <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>
        </div>

        {/* Action link */}
        <div
          style={{ transform: 'translateZ(5px)' }}
          className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors"
        >
          <span>Learn More</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      id: 'skill-gap',
      title: 'Skill Gap Analysis',
      description:
        'Identify individual and organizational skill gaps through assessments and competency analysis.',
      icon: Target,
      tag: 'Assessment',
    },
    {
      id: 'personalized-learning',
      title: 'Personalized Learning',
      description:
        'Get tailored courses, learning paths and resources based on your skills, role and development needs.',
      icon: BookOpen,
      tag: 'Curriculum',
    },
    {
      id: 'ai-recommendations',
      title: 'AI-Powered Recommendations',
      description:
        'Receive intelligent training recommendations based on competency gaps, assessment results and learning progress.',
      icon: BrainCircuit,
      tag: 'Intelligence',
    },
    {
      id: 'capacity-radar',
      title: 'Capacity Radar & Analytics',
      description:
        'Visualize organizational capability, identify critical skill gaps and track improvement over time.',
      icon: Activity,
      tag: 'Analytics USP',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Build Capability
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Capacity Connect combines assessment, learning, recommendations, and analytics in one platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
