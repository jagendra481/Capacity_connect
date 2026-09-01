import React from 'react';

export const CompetencyTable = ({ matrix = [] }) => {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-100">Department Competency Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Current Avg</th>
              <th className="px-5 py-3">Required Target</th>
              <th className="px-5 py-3">Gap Index</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {matrix.map((d) => (
              <tr key={d.department_id} className="hover:bg-slate-800/30">
                <td className="px-5 py-3 font-semibold text-slate-200">{d.department_name}</td>
                <td className="px-5 py-3 font-bold text-brand-400">{d.avgCurrent}%</td>
                <td className="px-5 py-3 font-bold text-purple-400">{d.avgRequired}%</td>
                <td className="px-5 py-3 font-bold text-amber-400">{d.avgGap}pt</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetencyTable;
