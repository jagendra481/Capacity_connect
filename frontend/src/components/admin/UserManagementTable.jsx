import React, { useState } from 'react';
import { Users, Shield, RotateCcw } from 'lucide-react';
import adminService from '../../services/adminService';

export const UserManagementTable = ({ users = [], onRoleChange, onDataRefresh }) => {
  const [resettingId, setResettingId] = useState(null);

  const handleResetProgress = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to reset ALL scores and progress for "${user.full_name}"?\n\nThis will clear:\n- Course progress & completion\n- Assessment scores & attempts\n- Skill levels\n- XP points & streaks\n- Badges & certificates\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setResettingId(user.id);
    try {
      await adminService.resetUserProgress(user.id);
      alert(`All scores and progress for "${user.full_name}" have been reset successfully.`);
      if (onDataRefresh) onDataRefresh();
    } catch (error) {
      alert(`Failed to reset progress: ${error}`);
    } finally {
      setResettingId(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Users className="w-4 h-4 text-brand-400" />
          <span>User Role Administration</span>
        </h3>
        <span className="text-xs text-slate-400">{users.length} Users Registered</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Full Name</th>
              <th className="px-5 py-3">Email Address</th>
              <th className="px-5 py-3">Current Role</th>
              <th className="px-5 py-3">Role Authorization</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-100">{u.full_name}</td>
                <td className="px-5 py-3.5 text-slate-400">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={u.role}
                    onChange={(e) => onRoleChange(u.id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="trainee">Trainee</option>
                    <option value="trainer">Trainer</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => handleResetProgress(u)}
                    disabled={resettingId === u.id}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-[11px] font-bold rounded-lg border border-red-500/30 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Reset all scores and progress for ${u.full_name}`}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${resettingId === u.id ? 'animate-spin' : ''}`} />
                    <span>{resettingId === u.id ? 'Resetting...' : 'Reset Progress'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;

