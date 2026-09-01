import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 md:px-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} CAPACITY CONNECT. Digital Capacity Building & Learning Management Portal.</p>
        <p className="font-mono text-slate-600">Assess → Identify Gap → Recommend → Learn → Certify</p>
      </div>
    </footer>
  );
};

export default Footer;
