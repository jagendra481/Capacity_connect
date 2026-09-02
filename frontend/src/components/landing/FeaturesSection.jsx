import React, { useState } from 'react';
import { Target, BookOpen, BrainCircuit, Activity } from 'lucide-react';

const FeatureCard = ({ item }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const Icon = item.icon;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -y * 6, rotateY: x * 6 });
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
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors duration-200 h-full space-y-4"
      >
        {/* Subtle Icon Container */}
        <div
          style={{ transform: 'translateZ(12px)' }}
          className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>

        {/* Title & Description */}
        <div style={{ transform: 'translateZ(8px)' }} className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-100">
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            {item.description}
          </p>
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
    },
    {
      id: 'personalized-learning',
      title: 'Personalized Learning',
      description:
        'Get tailored courses, learning paths and resources based on your skills, role and development needs.',
      icon: BookOpen,
    },
    {
      id: 'ai-recommendations',
      title: 'AI-Powered Recommendations',
      description:
        'Receive intelligent training recommendations based on competency gaps, assessment results and learning progress.',
      icon: BrainCircuit,
    },
    {
      id: 'capacity-radar',
      title: 'Capacity Radar & Analytics',
      description:
        'Visualize organizational capability, identify critical skill gaps and track improvement over time.',
      icon: Activity,
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything You Need to Build Capability
          </h2>
          <p className="text-sm text-slate-400 font-normal">
            Capacity Connect combines assessment, learning, recommendations and analytics in one platform.
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
