import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Left Column: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Award className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white">
                CAPACITY CONNECT
              </span>
              <span className="text-xs font-medium text-cyan-400">
                Assess. Learn. Improve.
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Intelligent digital capacity building and learning management portal helping enterprise organizations identify skill gaps, personalize learning, and build future-ready workforces.
          </p>

          <div className="pt-2 space-y-2 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>contact@capacityconnect.org</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Enterprise Learning Center, Digital Building</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#home" className="hover:text-cyan-400 transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
            <li><a href="#capacity-radar" className="hover:text-cyan-400 transition-colors">Capacity Radar</a></li>
          </ul>
        </div>

        {/* Platform Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link></li>
            <li><Link to="/signup" className="hover:text-cyan-400 transition-colors">Sign Up</Link></li>
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Course Library</Link></li>
            <li><Link to="/skills/gap" className="hover:text-cyan-400 transition-colors">Skill Gap Analyzer</Link></li>
            <li><Link to="/ai/assistant" className="hover:text-cyan-400 transition-colors">AI Learning Assistant</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Security & Compliance</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Capacity Connect. All rights reserved.</p>
        <p className="font-mono text-[11px] text-slate-600">Digital Capacity Building & Competency Management Platform</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
