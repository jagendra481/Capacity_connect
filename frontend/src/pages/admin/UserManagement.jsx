import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Key,
  RotateCcw,
  Eye,
  Edit3,
  Download,
  BookOpen,
  Award,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Building,
  Phone,
  Mail,
  Calendar,
  X,
  Lock,
} from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, trainee, trainer, administrator
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailedProfile, setDetailedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Form states
  const [createFormData, setCreateFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'trainee',
    department_id: 1,
    designation: '',
    phone: '',
    organization: 'Ministry of Earth Sciences',
    qualifications: '',
    experience: '',
    skills: '',
  });

  const [newRole, setNewRole] = useState('trainee');
  const [newPassword, setNewPassword] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search: searchQuery,
        role: activeTab === 'all' ? '' : activeTab,
        status: statusFilter,
      });
      if (res?.data) {
        setUsers(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      showFeedbackMsg('error', 'Failed to retrieve users from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const showFeedbackMsg = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // View Detailed Profile
  const handleViewProfile = async (user) => {
    setSelectedUser(user);
    setProfileLoading(true);
    try {
      const res = await adminService.getUserDetails(user.id);
      if (res?.data) {
        setDetailedProfile(res.data);
      } else {
        setDetailedProfile(user);
      }
    } catch (err) {
      setDetailedProfile(user);
    } finally {
      setProfileLoading(false);
    }
  };

  // Status Actions
  const handleActivateUser = async (userId) => {
    try {
      await adminService.updateUserStatus(userId, 'active');
      showFeedbackMsg('success', 'User account successfully activated.');
      fetchUsers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    try {
      await adminService.updateUserStatus(selectedUser.id, 'suspended', suspendReason);
      showFeedbackMsg('success', `User account #${selectedUser.id} suspended.`);
      setShowSuspendModal(false);
      setSuspendReason('');
      fetchUsers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Role Change Action
  const handleConfirmRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await adminService.updateUserRole(selectedUser.id, newRole);
      showFeedbackMsg('success', `Role updated to ${newRole.toUpperCase()} for ${selectedUser.full_name}`);
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Password Reset Action
  const handleConfirmPasswordReset = async () => {
    if (!selectedUser || !newPassword) return;
    try {
      await adminService.resetUserPassword(selectedUser.id, newPassword);
      showFeedbackMsg('success', `Password successfully reset for ${selectedUser.email}`);
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Reset Trainee Course Progress
  const handleResetProgress = async (userId) => {
    if (!window.confirm('Are you sure you want to reset all course progress for this trainee? This will reset progress to 0%.')) {
      return;
    }
    try {
      await adminService.resetUserProgress(userId);
      showFeedbackMsg('success', 'Trainee course progress reset successfully.');
      if (selectedUser?.id === userId) {
        handleViewProfile(selectedUser);
      }
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Create User / Admin
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = createFormData.skills
        ? createFormData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await adminService.createUser({
        ...createFormData,
        skills: skillsArray,
      });

      showFeedbackMsg('success', `New ${createFormData.role.toUpperCase()} account created successfully.`);
      setShowCreateModal(false);
      setCreateFormData({
        full_name: '',
        email: '',
        password: '',
        role: 'trainee',
        department_id: 1,
        designation: '',
        phone: '',
        organization: 'Ministry of Earth Sciences',
        qualifications: '',
        experience: '',
        skills: '',
      });
      fetchUsers();
    } catch (err) {
      showFeedbackMsg('error', err.response?.data?.error || err.message);
    }
  };

  // Export Users CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Role', 'Status', 'Department', 'Phone', 'Created At'];
    const rows = users.map((u) => [
      u.id,
      `"${u.full_name || ''}"`,
      u.email,
      u.role,
      u.status || 'active',
      `"${u.department_name || ''}"`,
      `"${u.phone || ''}"`,
      u.created_at || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `capacity_connect_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Central User Lifecycle Command</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            User, Trainee & Admin Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Administer accounts, roles, access permissions, progress records, security suspensions, and credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 border border-brand-400/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User / Admin</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Role Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: 'All Users' },
              { id: 'trainee', label: 'Trainees' },
              { id: 'trainer', label: 'Trainers' },
              { id: 'administrator', label: 'Administrators' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Status Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="pending_approval">Pending Approval</option>
            </select>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search by name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 w-64 md:w-72 outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </form>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader size="medium" message="Fetching user database records..." />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">No users found matching your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role & Dept</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Competency / Progress</th>
                  <th className="py-3.5 px-4">Certificates</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => {
                  const isActive = (u.status || 'active') === 'active';
                  const isSuspended = u.status === 'suspended';
                  const isPending = u.status === 'pending_approval' || u.status === 'pending';

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              u.profile_image ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.full_name || 'User')}`
                            }
                            alt={u.full_name}
                            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                              <span>{u.full_name || 'Unnamed User'}</span>
                              {u.role === 'super_admin' && (
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold border border-red-500/30">
                                  SUPER ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'super_admin' || u.role === 'administrator'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : u.role === 'trainer'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-1">{u.department_name || 'General Dept'}</div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : isSuspended
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-400' : isSuspended ? 'bg-red-400' : 'bg-amber-400'
                            }`}
                          ></span>
                          <span>{u.status || 'active'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Competency:</span>
                            <span className="font-bold text-brand-400">{u.competency_score || 85}%</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 rounded-full"
                              style={{ width: `${u.competency_score || 85}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-300">
                          {u.certificates_count ?? 0} Earned
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => handleViewProfile(u)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                            title="View Full Profile & Detailed Records"
                          >
                            <Eye className="w-3.5 h-3.5 text-brand-400" />
                          </button>

                          {/* Edit Role */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role || 'trainee');
                              setShowRoleModal(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                            title="Change Role"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setNewPassword('');
                              setShowPasswordModal(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                            title="Reset Password"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          {/* Reset Progress (For Trainees) */}
                          {u.role === 'trainee' && (
                            <button
                              onClick={() => handleResetProgress(u.id)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                              title="Reset Trainee Course Progress"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                          )}

                          {/* Suspend / Reactivate */}
                          {isSuspended ? (
                            <button
                              onClick={() => handleActivateUser(u.id)}
                              className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all"
                              title="Reactivate Account"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setSuspendReason('');
                                setShowSuspendModal(true);
                              }}
                              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                              title="Suspend User Account"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. Modal: View Detailed Profile & Drilldown */}
      {selectedUser && detailedProfile && !showRoleModal && !showPasswordModal && !showSuspendModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    detailedProfile.profile_image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(detailedProfile.full_name || 'User')}`
                  }
                  alt={detailedProfile.full_name}
                  className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>{detailedProfile.full_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase">
                      {detailedProfile.role}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{detailedProfile.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setDetailedProfile(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileLoading ? (
              <Loader size="medium" message="Loading detailed user history..." />
            ) : (
              <div className="space-y-6">
                {/* Profile Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Designation & Org</span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">
                      {detailedProfile.profile?.designation || detailedProfile.designation || 'Staff'}
                    </p>
                    <p className="text-[11px] text-slate-400">{detailedProfile.profile?.organization || 'MoES'}</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Department</span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">
                      {detailedProfile.department?.name || detailedProfile.department_name || 'General Operations'}
                    </p>
                    <p className="text-[11px] text-slate-400">{detailedProfile.profile?.phone || 'No phone recorded'}</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Competency XP</span>
                    <p className="text-xs font-bold text-brand-400 mt-0.5">
                      {detailedProfile.profile?.xp || 1450} XP • Score: {detailedProfile.profile?.competency_score || 92}%
                    </p>
                    <p className="text-[11px] text-slate-400">Account Status: <span className="text-emerald-400 font-bold uppercase">{detailedProfile.status || 'ACTIVE'}</span></p>
                  </div>
                </div>

                {/* Enrolled Courses & Progress (For Trainees) */}
                {detailedProfile.enrollments && detailedProfile.enrollments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enrolled Courses & Progress History</span>
                    </h4>
                    <div className="space-y-2">
                      {detailedProfile.enrollments.map((en, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{en.course_title || `Course #${en.course_id}`}</p>
                            <p className="text-[10px] text-slate-400">Status: <span className="font-semibold text-slate-300">{en.status}</span></p>
                          </div>
                          <div className="w-32 text-right">
                            <span className="text-xs font-bold text-emerald-400">{en.progress_percentage || 0}%</span>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${en.progress_percentage || 0}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {detailedProfile.certificates && detailedProfile.certificates.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Digital Certificates ({detailedProfile.certificates.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {detailedProfile.certificates.map((cert, idx) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{cert.certificate_number || cert.certificate_id || `CERT-${cert.id}`}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Hash: {cert.verification_hash ? cert.verification_hash.substring(0, 24) + '...' : 'Pending Gen'}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {cert.status || 'APPROVED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Audit Logs for this User */}
                {detailedProfile.auditLogs && detailedProfile.auditLogs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                      <span>Security & Lifecycle Audit Trail</span>
                    </h4>
                    <div className="space-y-1.5">
                      {detailedProfile.auditLogs.map((log, idx) => (
                        <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between">
                          <span className="font-mono text-red-400">{log.action}</span>
                          <span className="text-slate-400">{new Date(log.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Modal: Create New User / Admin */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-brand-400" />
                <span>Create New User or Administrator</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.full_name}
                    onChange={(e) => setCreateFormData({ ...createFormData, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500"
                    placeholder="e.g. Dr. Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500"
                    placeholder="e.g. rajesh@moes.gov.in"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Assign Role *</label>
                  <select
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500 font-bold"
                  >
                    <option value="trainee">Trainee (Learner)</option>
                    <option value="trainer">Trainer (Instructor)</option>
                    <option value="administrator">Administrator (System Control)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Designation</label>
                  <input
                    type="text"
                    value={createFormData.designation}
                    onChange={(e) => setCreateFormData({ ...createFormData, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500"
                    placeholder="e.g. Senior Scientific Officer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Organization</label>
                  <input
                    type="text"
                    value={createFormData.organization}
                    onChange={(e) => setCreateFormData({ ...createFormData, organization: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500"
                    placeholder="e.g. INCOIS / MoES"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Skills & Competencies (comma separated)</label>
                <input
                  type="text"
                  value={createFormData.skills}
                  onChange={(e) => setCreateFormData({ ...createFormData, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-brand-500"
                  placeholder="e.g. Ocean Remote Sensing, Python, GIS, Hydrodynamics"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Change Role */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Change Role for {selectedUser.full_name}
            </h3>
            <p className="text-xs text-slate-400">
              Modifying roles grants or restricts access across Trainee, Trainer, and Admin platforms immediately.
            </p>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-brand-500"
            >
              <option value="trainee">Trainee</option>
              <option value="trainer">Trainer</option>
              <option value="administrator">Administrator</option>
            </select>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow"
              >
                Apply Role Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Reset Password */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-amber-400" />
              <span>Reset Password for {selectedUser.email}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Enter a new secure password. The user will be required to authenticate with these new credentials.
            </p>

            <input
              type="password"
              placeholder="Enter new password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPasswordReset}
                disabled={!newPassword || newPassword.length < 6}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow"
              >
                Save New Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Suspend Account */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-red-400 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Suspend Account: {selectedUser.full_name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Suspended users will immediately lose access to the portal until reactivated by an administrator.
            </p>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Reason for Suspension</label>
              <textarea
                rows={3}
                placeholder="e.g. Inactivity, Policy Violation, Department Transfer..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
