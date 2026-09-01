import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const CompetencyChart = ({ matrix = [] }) => {
  const chartData = matrix.map(d => ({
    name: d.department_code || d.department_name,
    Current: d.avgCurrent,
    Required: d.avgRequired,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <h4 className="text-sm font-bold text-slate-100">Departmental Competency Benchmarks</h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Current" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Required" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompetencyChart;
