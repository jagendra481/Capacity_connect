import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, Target, BookOpen, TrendingUp, Award, Layers } from 'lucide-react';
import Button from '../common/Button';

export const HeroSection = () => {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  // Mouse Parallax Effect for 3D Capability Core
  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTransform({
      rotateX: -y * 18, // Max 9 deg tilt
      rotateY: x * 18,
      scale: 1.02,
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
      className="relative min-h-[calc(100vh-80px)] flex items-center py-16 lg:py-24 overflow-hidden bg-slate-950 text-slate-100"
    >
      {/* Subtle Restrained Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs (60% width) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Subtle Platform Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Digital Capacity Building Platform</span>
            </div>

            {/* Main Heading — Highlight ONLY "Capacity" */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.12]">
              Assess. Learn. Improve.{' '}
              <span className="block mt-2 font-black text-white">
                Build Organizational <span className="text-cyan-400 relative inline-block">Capacity</span>.
              </span>
            </h1>

            {/* Short Restrained Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Capacity Connect is an intelligent digital platform that helps organizations identify skill gaps, deliver personalized learning, and build a future-ready workforce.
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button to="/signup" variant="primary" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
              <Button to="/login" variant="outline" size="lg">
                Login
              </Button>
            </div>

            {/* Minimal Metrics Bar */}
            <div className="pt-8 border-t border-slate-800/60 grid grid-cols-3 gap-6 max-w-md text-slate-400">
              <div>
                <p className="text-2xl font-bold text-slate-100">99.4%</p>
                <p className="text-xs text-slate-400 mt-0.5">Skill Precision</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">6 Core</p>
                <p className="text-xs text-slate-400 mt-0.5">Radar Dimensions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Verifiable Certs</p>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Capability Core Visual (40% width) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div
              style={{
                perspective: '1000px',
              }}
              className="w-full max-w-sm sm:max-w-md py-6"
            >
              <div
                style={{
                  transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center"
              >
                {/* 3D Outer Orbit Rings */}
                <div
                  style={{ transform: 'translateZ(-40px) rotateX(65deg)' }}
                  className="absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_25s_linear_infinite] pointer-events-none"
                />
                <div
                  style={{ transform: 'translateZ(-20px) rotateY(55deg)' }}
                  className="absolute inset-2 border border-slate-700/50 rounded-full animate-[spin_35s_linear_infinite_reverse] pointer-events-none"
                />

                {/* Central Translucent 3D Capability Sphere */}
                <div
                  style={{ transform: 'translateZ(0px)' }}
                  className="w-40 h-40 rounded-full bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 flex items-center justify-center relative overflow-hidden backdrop-blur-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-teal-400/10" />
                  <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                    <Layers className="w-9 h-9 text-cyan-400" />
                  </div>
                </div>

                {/* Floating 3D Node Card 1: Skills */}
                <div
                  style={{ transform: 'translate3d(-90px, -70px, 45px)' }}
                  className="absolute p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md flex items-center space-x-2.5"
                >
                  <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-100">Skills</p>
                    <p className="text-[9px] text-slate-400">Precision Analysis</p>
                  </div>
                </div>

                {/* Floating 3D Node Card 2: Learning */}
                <div
                  style={{ transform: 'translate3d(90px, -40px, 35px)' }}
                  className="absolute p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md flex items-center space-x-2.5"
                >
                  <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400 border border-teal-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-100">Learning</p>
                    <p className="text-[9px] text-slate-400">Adaptive Paths</p>
                  </div>
                </div>

                {/* Floating 3D Node Card 3: Progress */}
                <div
                  style={{ transform: 'translate3d(-80px, 80px, 40px)' }}
                  className="absolute p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md flex items-center space-x-2.5"
                >
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-100">Progress</p>
                    <p className="text-[9px] text-slate-400">+14.2% YoY Gain</p>
                  </div>
                </div>

                {/* Floating 3D Node Card 4: Competency */}
                <div
                  style={{ transform: 'translate3d(85px, 75px, 50px)' }}
                  className="absolute p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md flex items-center space-x-2.5"
                >
                  <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-100">Competency</p>
                    <p className="text-[9px] text-slate-400">Verified Index</p>
                  </div>
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
