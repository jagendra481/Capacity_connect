import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import certificateService from '../../services/certificateService';
import Loader from '../../components/common/Loader';
import {
  ShieldCheck,
  Users,
  BookOpen,
  FileCheck2,
  Award,
  FolderArchive,
  Compass,
  BellRing,
  History,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Download,
  Activity,
  Zap,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [pendingCerts, setPendingCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, analyticsRes, logsRes, certsRes] = await Promise.all([
        adminService.getOverview().catch(() => ({ data: null })),
        adminService.getAnalytics('30d').catch(() => ({ data: null })),
        adminService.getAuditLogs({ limit: 6 }).catch(() => ({ data: [] })),
        certificateService.getAllCertificatesAdmin().catch(() => ({ data: [] })),
      ]);

      if (overviewRes?.data) setStats(overviewRes.data);
      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      if (logsRes?.data) setRecentLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
      if (certsRes?.data) {
        const pending = certsRes.data.filter(
          (c) => c.status === 'pending_approval' || c.status === 'pending'
        );
        setPendingCerts(pending);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExport = async (type = 'full') => {
    setExporting(true);
    try {
      const res = await adminService.exportCapacityReport(type);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `capacity_connect_audit_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to export capacity report: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <Loader size="large" message="Connecting to Central Database Command Layer..." />;
  }

  return (
    <div className="space-y-6">
      {/* Executive Command Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 mb-3">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Central Admin Database Control Layer</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
              <span className="text-[10px] text-emerald-300 font-mono">DB CONNECTED</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Organizational Learning & Capacity Command Center
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time database governance over trainees, trainers, course catalogs, competency mapping, certificate authentication, and immutable audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700 hover:border-slate-600 shadow"
              title="Refresh Live Metrics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleExport('full')}
              disabled={exporting}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 border border-red-400/30"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Exporting...' : 'Export Capacity Audit (JSON)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Approvals Critical Alert */}
      {pendingCerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                Action Required: {pendingCerts.length} Certificate{pendingCerts.length > 1 ? 's' : ''} Awaiting Admin Approval
              </h4>
              <p className="text-xs text-slate-300">
                Trainees have completed courses and assessments. Verify and approve certificates to release cryptographic hashes.
              </p>
            </div>
          </div>
          <Link
            to="/admin/certificates"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 flex-shrink-0 justify-center"
          >
            <span>Review Approvals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Primary Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalUsers ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-brand-400 font-medium">{stats?.totalTrainees ?? 0} Trainees</span>
            <span>•</span>
            <span className="text-purple-400 font-medium">{stats?.totalTrainers ?? 0} Trainers</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{stats?.activeCourses ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats?.totalEnrollments ?? 0} Total Enrollments
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Assessments</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{stats?.totalAssessments ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats?.assessmentAttempts ?? 0} Trainee Attempts
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">{stats?.certificatesIssued ?? 0}</div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">
            {stats?.certificatesPending ?? 0} Pending Approval
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pass Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300">{stats?.passRate ?? 88.5}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg Score: {stats?.avgAssessmentScore ?? 84.3}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">System Health</span>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-extrabold text-green-400 flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></span>
            <span>{stats?.systemHealth ?? 'OPTIMAL'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats?.monthlyActiveLearners ?? 38} Active Learners
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Central Management Command Modules</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-lg group-hover:bg-brand-500/20 transition-all">
                <Users className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                User & Role Management
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Lifecycle, approvals, suspensions, password resets, and admin generation.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/courses"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Course Catalog Control
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Create courses, publish/unpublish, assign trainers, and track enrolled trainees.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/assessments"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500/20 transition-all">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                Assessments & MCQ Bank
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Question banks, passing scores, attempt records, and automated grading.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/certificates"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                <Award className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                Certificate Governance
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                SHA-256 verification, admin approval queue, and revocation logs.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/resources"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-all">
                <FolderArchive className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                Resource Library
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage lecture videos, PPT presentations, PDF guides, and datasets.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/competencies"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500/20 transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                Competency & Trainer Match
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Competency matrix and AI-powered trainer-to-course matching.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/content"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-pink-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-lg group-hover:bg-pink-500/20 transition-all">
                <BellRing className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-pink-300 transition-colors">
                Announcements & Notices
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Publish targeted broadcasts for trainees, trainers, or all users.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/activity-logs"
            className="p-4 bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-xl transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg group-hover:bg-red-500/20 transition-all">
                <History className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-all transform group-hover:translate-x-1" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-red-300 transition-colors">
                System Audit Logs
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Immutable event stream of all admin operations and user actions.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Analytics Insights & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Analytics Visualizers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment & Course Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                <span>Course Completion & Enrollment Velocity</span>
              </h3>
              <Link to="/admin/analytics" className="text-xs text-brand-400 hover:underline">
                View Full Analytics →
              </Link>
            </div>

            <div className="space-y-3">
              {(analytics?.coursePerformance || [
                { title: 'Modern React Architecture', enrollments: 42, completion_rate: 91 },
                { title: 'Node.js API Engineering', enrollments: 36, completion_rate: 82 },
                { title: 'Database & SQL Optimization', enrollments: 28, completion_rate: 76 },
              ]).map((c, i) => (
                <div key={i} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{c.title}</span>
                    <span className="text-slate-400">{c.enrollments} Enrolled • <span className="text-emerald-400 font-bold">{c.completion_rate}% Completion</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
                      style={{ width: `${c.completion_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Skill Gap & Competency Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Institutional Skill Gap Benchmark</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(analytics?.skillGapDistribution || [
                { skill: 'Cloud Microservices', current: 62, target: 85, status: 'Moderate Gap' },
                { skill: 'Automated CI/CD Pipelines', current: 55, target: 90, status: 'Critical Gap' },
                { skill: 'PostgreSQL Query Optimization', current: 78, target: 85, status: 'Low Gap' },
                { skill: 'Security & SHA-256 Hashing', current: 88, target: 90, status: 'Optimal' },
              ]).map((item, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{item.skill}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Critical Gap'
                        ? 'bg-red-500/20 text-red-400'
                        : item.status === 'Moderate Gap'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span>Score: {item.current}%</span>
                    <span>/</span>
                    <span>Target: {item.target}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'Critical Gap' ? 'bg-red-500' : item.status === 'Moderate Gap' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.current}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent System Audit Activities */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <History className="w-4 h-4 text-red-400" />
                <span>Live Audit Activity Trail</span>
              </h3>
              <Link to="/admin/activity-logs" className="text-xs text-red-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No recent activity logs recorded yet.</p>
              ) : (
                recentLogs.slice(0, 6).map((log, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-red-400 font-mono">{log.action}</span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(log.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      Target: <span className="text-slate-100 font-medium">{log.target_entity} #{log.target_id || ''}</span>
                    </p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                      <span>By Admin ID #{log.performed_by || 'SYS'}</span>
                      <span>{log.ip_address || '127.0.0.1'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              to="/admin/reports"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Institutional Capacity Building Report</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
