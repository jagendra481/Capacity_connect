import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import UserManagementTable from '../../components/admin/UserManagementTable';
import DepartmentManagementTable from '../../components/admin/DepartmentManagementTable';
import Loader from '../../components/common/Loader';
import { ShieldCheck, Users, Building, BookOpen, FileSpreadsheet, Download, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = () => {
    Promise.all([
      adminService.getOverview(),
      adminService.getUsers(),
      adminService.getDepartments(),
      adminService.getAnalytics(),
    ])
      .then(([oRes, uRes, dRes, aRes]) => {
        if (oRes.data) setStats(oRes.data);
        if (uRes.data) setUsers(uRes.data);
        if (dRes.data) setDepartments(dRes.data);
        if (aRes.data) setAnalytics(aRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await adminService.updateUserRole(userId, newRole);
    loadAdminData();
  };

  const handleExportReport = async () => {
    const res = await adminService.exportCapacityReport();
    alert(`Capacity Report Generated Successfully: ${res.data?.reportTitle}`);
  };

  if (loading) return <Loader size="large" message="Loading Admin Executive Console..." />;

  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Administrator Governance Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              Organizational Capacity & System Control Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Global user management, role authorization, department benchmarks, and capacity audit exports.
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Capacity Audit Report</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Total System Users</span>
          <p className="text-2xl font-extrabold text-slate-100">{stats?.totalUsers || users.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Departments</span>
          <p className="text-2xl font-extrabold text-purple-400">{stats?.totalDepartments || departments.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Org Capacity Score</span>
          <p className="text-2xl font-extrabold text-brand-400">{stats?.avgOrganizationalCompetency || 74.8}%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase">Critical Skill Gaps</span>
          <p className="text-2xl font-extrabold text-red-400">{stats?.criticalGapsCount || 4} Gaps</p>
        </div>
      </div>

      {/* Analytics & User Management Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AnalyticsChart data={analytics?.skillGapDistribution || []} />
        </div>

        <div className="lg:col-span-2">
          <UserManagementTable users={users} onRoleChange={handleRoleChange} />
        </div>
      </div>

      <DepartmentManagementTable departments={departments} />
    </div>
  );
};

export default AdminDashboard;
