import React from 'react';
import { Users, Shield } from 'lucide-react';

export const UserManagementTable = ({ users = [], onRoleChange }) => {
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
              <th className="px-5 py-3 text-right">Role Authorization</th>
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
                <td className="px-5 py-3.5 text-right">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
