import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 md:px-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} CAPACITY CONNECT. Ministry of Earth Sciences (MoES) • India Meteorological Department (IMD) | SIH PS ID: 26075</p>
        <p className="font-mono text-cyan-400/80">Smart Education • Assess → Identify Gap → Recommend → Learn → Certify</p>
      </div>
    </footer>
  );
};

export default Footer;
