import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, Menu, X, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + href);
        return;
      }
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-lg'
          : 'bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight">
                CAPACITY CONNECT
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 flex items-center space-x-1">
                <span>Assess</span>
                <span className="text-slate-600">•</span>
                <span>Learn</span>
                <span className="text-slate-600">•</span>
                <span>Improve</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button to="/login" variant="outline" size="md">
              Login
            </Button>
            <Button to="/signup" variant="primary" size="md" icon={ArrowRight}>
              Sign Up
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2 px-2">
            <Button to="/login" variant="outline" size="md" className="w-full justify-center">
              Login
            </Button>
            <Button to="/signup" variant="primary" size="md" icon={ArrowRight} className="w-full justify-center">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
