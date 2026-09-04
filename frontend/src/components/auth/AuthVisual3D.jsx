import React from 'react';

/**
 * Minimalist, elegant, abstract 3D visual element for the authentication split-screen left panel
 */
export const AuthVisual3D = () => {
  return (
    <div className="relative w-full max-w-md h-80 flex items-center justify-center">
      {/* Background Radial Glow */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Abstract Glowing Capability Orb */}
      <div className="relative w-48 h-48 rounded-full border border-cyan-500/30 bg-gradient-to-tr from-slate-900/90 via-slate-900/40 to-cyan-950/60 backdrop-blur-xl shadow-2xl flex items-center justify-center p-6 transform hover:scale-105 transition-transform duration-700">
        
        {/* Inner Rotating Ring */}
        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]" />

        {/* Orbiting Capability Nodes */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400/90 shadow-lg shadow-cyan-400/50 flex items-center justify-center text-[10px] font-bold text-slate-950">
          AI
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-400/90 shadow-lg shadow-purple-400/50 flex items-center justify-center text-[10px] font-bold text-slate-950">
          XP
        </div>
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-400/90 shadow-lg shadow-indigo-400/50 flex items-center justify-center text-[10px] font-bold text-slate-950">
          ROI
        </div>
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400/90 shadow-lg shadow-amber-400/50 flex items-center justify-center text-[10px] font-bold text-slate-950">
          70%
        </div>

        {/* Central Core Icon/Graphic */}
        <svg className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>
  );
};

export default AuthVisual3D;
