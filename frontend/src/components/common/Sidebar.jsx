import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  FileCheck2,
  Bot,
  Award,
  Share2,
  Calendar,
  Users,
  BarChart3,
  Radar,
  Sparkles,
  Zap,
  FolderArchive,
  Compass,
  BellRing,
  ShieldCheck,
  History,
  FileSpreadsheet,
} from 'lucide-react';

export const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'trainee';
  const isAdmin = role === 'administrator' || role === 'super_admin';

  const traineeLinks = [
    { to: '/trainee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trainee/courses', label: 'My Courses', icon: BookOpen },
    { to: '/trainee/skills', label: 'Skill Gap Engine', icon: Target },
    { to: '/trainee/assessments', label: 'Assessments', icon: FileCheck2 },
    { to: '/ai/assistant', label: 'AI Learning Assistant', icon: Bot },
    { to: '/trainee/recommendations', label: 'Recommendations', icon: Sparkles },
    { to: '/trainee/achievements', label: 'Achievements', icon: Zap },
    { to: '/trainee/certificates', label: 'Certificates', icon: Award },
    { to: '/knowledge', label: 'Knowledge Hub', icon: Share2 },
    { to: '/calendar', label: 'Training Calendar', icon: Calendar },
  ];

  const trainerLinks = [
    { to: '/trainer/dashboard', label: 'Trainer Overview', icon: LayoutDashboard },
    { to: '/trainer/courses', label: 'Manage Courses', icon: BookOpen },
    { to: '/trainer/assessments', label: 'Assessment Engine', icon: FileCheck2 },
    { to: '/trainer/trainees', label: 'Assigned Trainees', icon: Users },
    { to: '/calendar', label: 'Training Calendar', icon: Calendar },
    { to: '/knowledge', label: 'Knowledge Hub', icon: Share2 },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Executive Command Center', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User & Role Management', icon: Users },
    { to: '/admin/courses', label: 'Course Catalog Control', icon: BookOpen },
    { to: '/admin/assessments', label: 'Assessments & MCQs', icon: FileCheck2 },
    { to: '/admin/certificates', label: 'Certificate Approvals', icon: Award },
    { to: '/admin/resources', label: 'Learning Resource Library', icon: FolderArchive },
    { to: '/admin/competencies', label: 'Competency & Trainer Match', icon: Compass },
    { to: '/admin/content', label: 'Announcements & Broadcasts', icon: BellRing },
    { to: '/admin/capacity-radar', label: 'Capacity Radar USP', icon: Radar },
    { to: '/admin/analytics', label: 'Analytics & Benchmarks', icon: BarChart3 },
    { to: '/admin/reports', label: 'Capacity Reports & Export', icon: FileSpreadsheet },
    { to: '/admin/activity-logs', label: 'System Audit Logs', icon: History },
  ];

  const links = isAdmin ? adminLinks : role === 'trainer' ? trainerLinks : traineeLinks;

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-6">
        <div>
          <div className="flex items-center space-x-2 px-3 mb-3">
            {isAdmin ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Command</span>
              </span>
            ) : (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Menu ({role})
              </p>
            )}
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
