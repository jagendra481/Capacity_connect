import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export const CTASection = () => {
  return (
    <section className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-14 text-center space-y-6 shadow-xl">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Build a More Capable Workforce?
          </h2>

          <p className="text-base text-slate-300 max-w-lg mx-auto font-normal">
            Start your journey with Capacity Connect.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button to="/signup" variant="primary" size="lg" icon={ArrowRight}>
              Create Your Account
            </Button>
            <Button to="/login" variant="outline" size="lg">
              Explore Platform
            </Button>
          </div>

          <p className="text-xs text-slate-500 pt-2 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Instant setup • Secure enterprise role-based authorization</span>
          </p>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
