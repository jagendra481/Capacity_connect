import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export const CTASection = () => {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Banner Frame */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-2xl overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider relative z-10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Transform Your Workforce Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight relative z-10 max-w-3xl mx-auto">
            Ready to Build a More Capable Workforce?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal relative z-10">
            Start your journey with Capacity Connect today and bridge individual skill gaps to drive enterprise excellence.
          </p>

          {/* Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Button to="/signup" variant="primary" size="lg" icon={ArrowRight}>
              Create Your Account
            </Button>
            <Button to="/login" variant="outline" size="lg">
              Explore Platform
            </Button>
          </div>

          {/* Subtext */}
          <p className="text-xs text-slate-500 pt-2 flex items-center justify-center space-x-1 relative z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant setup • Secure enterprise role-based authorization</span>
          </p>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
