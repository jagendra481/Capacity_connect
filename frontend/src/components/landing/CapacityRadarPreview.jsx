import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Activity, ShieldAlert, TrendingUp } from 'lucide-react';
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
    { dept: 'Software Engineering', score: 86, gap: 'Low Gap', tagStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { dept: 'AI & Data Science', score: 91, gap: 'Low Gap', tagStyle: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { dept: 'Cloud Architecture', score: 74, gap: 'Medium Gap', tagStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { dept: 'Cyber Security', score: 58, gap: 'Critical Gap', tagStyle: 'bg-red-500/10 text-red-400 border-red-500/20' },
  ];

  return (
    <section id="capacity-radar" className="py-20 bg-slate-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core USP Feature</span>
            </div>

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

          {/* Right Column: Layered Pseudo-3D Product Interface */}
          <div className="lg:col-span-7" style={{ perspective: '1000px' }}>
            <div
              style={{ transform: 'rotateX(2deg) rotateY(-2deg)' }}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 relative transition-transform duration-300 hover:rotate-0"
            >
              {/* Product Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Capacity Radar Analytics</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Competency Benchmark vs Target Requirement</p>
                </div>

                <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-cyan-400">
                  Org Score: 78.4
                </span>
              </div>

              {/* Grid: Radar Visualization + Department Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Radar Chart */}
                <div className="h-60 w-full bg-slate-900/90 border border-slate-800 rounded-xl p-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarDimensions}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 8 }} />
                      <Radar name="Current" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                      <Radar name="Target" dataKey="required" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Department Indicators */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Department Benchmarks
                  </h4>

                  {departmentBars.map((dept) => (
                    <div key={dept.dept} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200 text-[11px]">{dept.dept}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded border ${dept.tagStyle}`}>
                            {dept.gap}
                          </span>
                          <span className="font-mono text-slate-100 font-bold text-xs">{dept.score}%</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-slate-800">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${dept.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Financial ROI Layered Card */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Annual Productivity Impact: <strong className="text-emerald-400">$219,000 Net Gain</strong></span>
                </div>
                <span className="text-[11px] text-slate-400">Payback Period: <strong className="text-slate-200">0.3 Mo</strong></span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CapacityRadarPreview;
