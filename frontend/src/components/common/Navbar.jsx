import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, LogOut, User, Shield, Menu, Award } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CAPACITY CONNECT
            </span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/notifications"
              className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900" />
              )}
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center space-x-3">
              <Link to="/trainee/profile" className="flex items-center space-x-2 group">
                <img
                  src={user.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.full_name || 'User')}`}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover group-hover:border-brand-500 transition-colors"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition-colors">
                    {user.full_name}
                  </p>
                  <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {user.role}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors shadow-lg shadow-brand-600/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
