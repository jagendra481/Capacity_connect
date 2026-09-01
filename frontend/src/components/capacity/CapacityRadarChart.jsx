import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

export const CapacityRadarChart = ({ dimensions = [] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-100">Multi-Dimensional Organizational Capacity Radar</h3>
        <p className="text-xs text-slate-400">Comparing current operational readiness against target capacity benchmarks</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={dimensions}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
            <Radar name="Current Capacity" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
            <Radar name="Target Requirement" dataKey="required" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CapacityRadarChart;
