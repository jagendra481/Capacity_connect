import React from 'react';
import { Building } from 'lucide-react';

export const DepartmentManagementTable = ({ departments = [] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Building className="w-4 h-4 text-purple-400" />
          <span>Enterprise Departments</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Department Name</th>
              <th className="px-5 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {departments.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3 font-extrabold text-purple-400">{d.code}</td>
                <td className="px-5 py-3 font-bold text-slate-100">{d.name}</td>
                <td className="px-5 py-3 text-slate-400">{d.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentManagementTable;
