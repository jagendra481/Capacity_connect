import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import Button from '../common/Button';

export const CapacityRadarPreview = () => {
  const radarDimensions = [
    { dimension: 'Technical', current: 78, required: 85 },
    { dimension: 'Process', current: 72, required: 80 },
    { dimension: 'Tools', current: 82, required: 85 },
    { dimension: 'Domain', current: 85, required: 90 },
    { dimension: 'AI & Innovation', current: 62, required: 85 },
    { dimension: 'Leadership', current: 68, required: 75 },
  ];

  const departmentBars = [
    { dept: 'Software Engineering', score: 86, gap: 'Low Gap', tagStyle: 'text-emerald-400 bg-emerald-500/10' },
    { dept: 'AI & Data Science', score: 91, gap: 'Low Gap', tagStyle: 'text-cyan-400 bg-cyan-500/10' },
    { dept: 'Cloud Architecture', score: 74, gap: 'Medium Gap', tagStyle: 'text-amber-400 bg-amber-500/10' },
    { dept: 'Cyber Security', score: 58, gap: 'Critical Gap', tagStyle: 'text-red-400 bg-red-500/10' },
  ];

  return (
    <section id="capacity-radar" className="py-20 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              See Your Organization's Capability at a Glance
            </h2>

            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Capacity Radar provides an organization-wide view of competency levels, critical skill gaps and improvement trends, helping decision-makers identify where training is needed most.
            </p>

            <div className="pt-2">
              <Button to="/signup" variant="primary" size="lg">
                Explore Capacity Radar →
              </Button>
            </div>
          </div>

          {/* Right Column: Clean Layered Pseudo-3D Panel */}
          <div className="lg:col-span-7" style={{ perspective: '1000px' }}>
            <div
              style={{ transform: 'rotateX(2deg) rotateY(-2deg)' }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 transition-transform duration-300 hover:rotate-0"
            >
              {/* Product Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Capacity Radar Analytics</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Org Score: <strong className="text-cyan-400">78.4</strong>
                </span>
              </div>

              {/* Grid: Radar + Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Radar Chart */}
                <div className="h-56 w-full bg-slate-950 border border-slate-800/80 rounded-xl p-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarDimensions}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 8 }} />
                      <Radar name="Current" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                      <Radar name="Target" dataKey="required" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Department Scores */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Department Benchmarks
                  </h4>

                  {departmentBars.map((dept) => (
                    <div key={dept.dept} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300 text-[11px]">{dept.dept}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${dept.tagStyle}`}>
                            {dept.gap}
                          </span>
                          <span className="font-mono text-slate-100 font-bold text-xs">{dept.score}%</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${dept.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CapacityRadarPreview;
