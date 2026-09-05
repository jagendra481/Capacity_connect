import React, { useState, useRef } from 'react';
import { ArrowRight, Target, BookOpen, TrendingUp, Award, Layers } from 'lucide-react';
import Button from '../common/Button';

export const HeroSection = () => {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  // Mouse Parallax Effect for 3D Capability Core
  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTransform({
      rotateX: -y * 14,
      rotateY: x * 14,
      scale: 1.01,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[calc(100vh-80px)] flex items-center py-20 lg:py-28 bg-slate-950 text-slate-100 border-b border-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Actions (60% width) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Category Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-900 border border-cyan-500/30 text-xs font-medium text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Ministry of Earth Sciences (MoES) • IMD | SIH PS ID: 26075</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.12]">
              Assess. Learn. Improve.{' '}
              <span className="block mt-2 font-black text-white">
                Build Digital <span className="text-cyan-400">Capacity</span>.
              </span>
            </h1>

            {/* Concise Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Centralized web portal for organizational training, competency mapping, subject-wise MCQ assessments, trainer libraries, and verifiable certificates.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button to="/signup" variant="primary" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
              <Button to="/login" variant="outline" size="lg">
                Login
              </Button>
            </div>

            {/* Key Metrics Row */}
            <div className="pt-10 border-t border-slate-900 grid grid-cols-3 gap-6 max-w-md text-slate-400">
              <div>
                <p className="text-2xl font-bold text-slate-100">99.4%</p>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">Skill Precision</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">6 Core</p>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">Radar Dimensions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">100%</p>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">Verifiable Certs</p>
              </div>
            </div>

          </div>

          {/* Right Column: Subtle 3D Capability Core Visual */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div
              style={{ perspective: '1000px' }}
              className="w-full max-w-sm sm:max-w-md py-4"
            >
              <div
                style={{
                  transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center"
              >
                {/* 3D Orbit Ring */}
                <div
                  style={{ transform: 'translateZ(-30px) rotateX(65deg)' }}
                  className="absolute inset-2 border border-slate-800 rounded-full pointer-events-none"
                />

                {/* Central Translucent Core Sphere */}
                <div
                  style={{ transform: 'translateZ(0px)' }}
                  className="w-40 h-40 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Layers className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                {/* Floating Node 1: Skills */}
                <div
                  style={{ transform: 'translate3d(-90px, -65px, 40px)' }}
                  className="absolute px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex items-center space-x-2"
                >
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">Skills Analysis</span>
                </div>

                {/* Floating Node 2: Learning */}
                <div
                  style={{ transform: 'translate3d(85px, -45px, 35px)' }}
                  className="absolute px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex items-center space-x-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200">Learning Paths</span>
                </div>

                {/* Floating Node 3: Progress */}
                <div
                  style={{ transform: 'translate3d(-85px, 75px, 35px)' }}
                  className="absolute px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex items-center space-x-2"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">Progress Tracker</span>
                </div>

                {/* Floating Node 4: Competency */}
                <div
                  style={{ transform: 'translate3d(80px, 70px, 45px)' }}
                  className="absolute px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex items-center space-x-2"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Verified Index</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
