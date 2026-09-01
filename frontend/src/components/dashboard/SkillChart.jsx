import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const SkillChart = ({ competencies = [] }) => {
  const chartData = competencies.length > 0 ? competencies : [
    { skill: 'React.js', required: 85, current: 75 },
    { skill: 'Node.js', required: 80, current: 65 },
    { skill: 'PostgreSQL', required: 75, current: 80 },
    { skill: 'AI RAG', required: 90, current: 55 },
    { skill: 'DevOps', required: 70, current: 60 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Skill Competency Comparison</h4>
          <p className="text-xs text-slate-400">Current skill level vs Required role benchmark</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="skill" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="current" name="Current Level" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="required" name="Required Level" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillChart;
