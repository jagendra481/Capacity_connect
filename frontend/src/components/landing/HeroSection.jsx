import React from 'react';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Award, BookOpen, BrainCircuit, TrendingUp, Users } from 'lucide-react';
import Button from '../common/Button';

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center py-16 md:py-24 overflow-hidden bg-slate-950">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[450px] h-[450px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Hero Text & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Digital Capacity Building Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Assess. Learn. Improve.{' '}
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Build Organizational Capacity.
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Capacity Connect is an intelligent digital platform that helps organizations identify skill gaps, deliver personalized learning, and build a future-ready workforce.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button to="/signup" variant="primary" size="lg" icon={ArrowRight}>
                Get Started
              </Button>
              <Button to="/login" variant="outline" size="lg">
                Login
              </Button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-400 max-w-lg">
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-slate-100">99.4%</p>
                <p className="text-xs text-slate-400">Skill Precision</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-cyan-400">6 Dimensions</p>
                <p className="text-xs text-slate-400">Capacity Radar</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">Verifiable Certs</p>
              </div>
            </div>

          </div>

          {/* Right Side: Enterprise Dashboard SaaS Illustration Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glowing Border Frame */}
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5 hover:border-cyan-500/40 transition-all duration-500">
                
                {/* Header Mockup Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">Capacity Radar Console</span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Metrics</span>
                  </span>
                </div>

                {/* Top Stat Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-semibold uppercase">Org Readiness</span>
                      <Activity className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-cyan-400">84.2 / 100</p>
                    <p className="text-[10px] text-emerald-400 font-medium">+14.2% YoY Improvement</p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-semibold uppercase">Active Trainees</span>
                      <Users className="w-4 h-4 text-teal-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-slate-100">1,248</p>
                    <p className="text-[10px] text-slate-400 font-medium">across 12 Departments</p>
                  </div>
                </div>

                {/* Competency Gap Progress Bars */}
                <div className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span className="flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Skill Benchmark Progress</span>
                    </span>
                    <span className="text-cyan-400">Target Met</span>
                  </div>

                  {/* Bar 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">Full-Stack & Cloud Architecture</span>
                      <span className="text-slate-200 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full w-[88%]" />
                    </div>
                  </div>

                  {/* Bar 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">AI & Automated Workflows</span>
                      <span className="text-slate-200 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full w-[92%]" />
                    </div>
                  </div>

                  {/* Bar 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-medium">Cyber Security Compliance</span>
                      <span className="text-slate-200 font-bold">74%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-amber-500 to-cyan-500 h-full rounded-full w-[74%]" />
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Alert Chip */}
                <div className="p-3 bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 rounded-2xl flex items-start space-x-3 text-left">
                  <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-300 border border-cyan-500/40 flex-shrink-0 mt-0.5">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-100 flex items-center space-x-1">
                      <span>AI Recommendation Engine</span>
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Auto-enrolled 42 engineers into "Micro-Frontend & Distributed State" to close critical skill gap.
                    </p>
                  </div>
                </div>

              </div>

              {/* Floating Badge 1: Verification */}
              <div className="absolute -top-4 -right-4 hidden sm:flex items-center space-x-2 px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-100">ISO & Government Ready</span>
              </div>

              {/* Floating Badge 2: Certified Badge */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center space-x-2 px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-100">Cryptographic Certificates</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
