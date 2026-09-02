import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, MapPin } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Left Column: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight">
                CAPACITY CONNECT
              </span>
              <span className="text-xs font-medium text-slate-400">
                Assess. Learn. Improve.
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
            Intelligent digital capacity building and learning management portal helping enterprise organizations identify skill gaps, personalize learning, and build future-ready workforces.
          </p>

          <div className="pt-1 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>contact@capacityconnect.org</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Enterprise Learning Center, Digital Building</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#home" className="hover:text-cyan-400 transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-cyan-400 transition-colors">About</a></li>
            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Platform Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link></li>
            <li><Link to="/signup" className="hover:text-cyan-400 transition-colors">Sign Up</Link></li>
            <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Courses</Link></li>
            <li><Link to="/trainee/assessments" className="hover:text-cyan-400 transition-colors">Assessments</Link></li>
            <li><Link to="/ai/assistant" className="hover:text-cyan-400 transition-colors">AI Assistant</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto pt-8 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Capacity Connect. All rights reserved.</p>
        <p className="font-mono text-[11px] text-slate-600">Digital Capacity Building & Learning Management Portal</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
