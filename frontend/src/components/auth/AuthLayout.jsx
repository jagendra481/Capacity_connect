import React from 'react';
import { Link } from 'react-router-dom';
import AuthVisual3D from './AuthVisual3D';
import { Zap, ShieldCheck } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Minimal Navigation Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            CAPACITY CONNECT
          </span>
        </Link>
      </header>

      {/* Main Split-Screen Two-Column Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Brand & Abstract 3D Section (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 p-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 w-max">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Enterprise Capacity & Competency Building</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Build Skills.<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Build Capability.
              </span>
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Identify skill gaps, learn through personalized training, and measure capability improvement with one intelligent platform.
            </p>

            {/* Subtle 3D Visual */}
            <div className="pt-4 flex items-center justify-center">
              <AuthVisual3D />
            </div>
          </div>

          {/* RIGHT SIDE: Authentication Form Card */}
          <div className="col-span-1 lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Card Subtle Top Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />
              {children}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full">
        &copy; 2026 CAPACITY CONNECT. Digital Capacity Building & Learning Management Portal.
      </footer>
    </div>
  );
};

export default AuthLayout;
