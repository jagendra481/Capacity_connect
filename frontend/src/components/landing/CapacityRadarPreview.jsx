import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Activity, ShieldAlert, Sparkles, TrendingUp, BarChart2, Layers } from 'lucide-react';
import Button from '../common/Button';

export const CapacityRadarPreview = () => {
  const radarDimensions = [
    { dimension: 'Technical Competency', current: 78, required: 85 },
    { dimension: 'Process Maturity', current: 72, required: 80 },
    { dimension: 'Tool Proficiency', current: 82, required: 85 },
    { dimension: 'Domain Knowledge', current: 85, required: 90 },
    { dimension: 'Innovation & AI', current: 62, required: 85 },
    { dimension: 'Leadership', current: 68, required: 75 },
  ];

  const departmentBars = [
    { dept: 'Software Engineering', score: 86, gap: 'Low Gap', color: 'bg-emerald-400', tagStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { dept: 'AI & Data Science', score: 91, gap: 'Low Gap', color: 'bg-cyan-400', tagStyle: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { dept: 'Cloud & Infrastructure', score: 74, gap: 'Medium Gap', color: 'bg-amber-400', tagStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { dept: 'Cyber Security & Audit', score: 58, gap: 'Critical Gap', color: 'bg-red-400', tagStyle: 'bg-red-500/10 text-red-400 border-red-500/20' },
  ];

  return (
    <section id="capacity-radar" className="py-20 bg-slate-900/90 border-t border-slate-800 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Platform Main USP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-[1.2]">
              See Your Organization's Capability at a Glance
            </h2>

            <p className="text-base text-slate-300 font-normal leading-relaxed">
              Capacity Radar provides an organization-wide view of competency levels, critical skill gaps and improvement trends, helping decision-makers identify where training is needed most.
            </p>

            {/* Quick Metrics Bullets */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">6 Core Capability Dimensions</h4>
                    <p className="text-[11px] text-slate-400">Technical, Process, Tools, Domain, AI & Leadership</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-cyan-400">0 - 100 Scale</span>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Automated Risk Indicators</h4>
                    <p className="text-[11px] text-slate-400">Categorizes Critical, Medium, and Low Gap severities</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-amber-400">Real-Time Alert</span>
              </div>
            </div>

            <div className="pt-2">
              <Button to="/signup" variant="primary" size="lg">
                Explore Capacity Radar →
              </Button>
            </div>
          </div>

          {/* Right Visual Mockup Column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative hover:border-cyan-500/30 transition-all">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>Organizational Capacity Radar</span>
                  </h3>
                  <p className="text-xs text-slate-400">Competency Level vs Target Requirement Benchmark</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold">
                    Score: 78.4 / 100
                  </span>
                </div>
              </div>

              {/* Grid: Radar Chart + Department Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Recharts Radar Chart */}
                <div className="h-64 w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl p-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarDimensions}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 8 }} />
                      <Radar name="Current Capacity" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                      <Radar name="Target Requirement" dataKey="required" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Department Capacity Bars */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Department Competency Scores
                  </h4>

                  {departmentBars.map((dept) => (
                    <div key={dept.dept} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 text-[11px]">{dept.dept}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${dept.tagStyle}`}>
                            {dept.gap}
                          </span>
                          <span className="font-mono text-slate-100 font-bold">{dept.score}%</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div className={`${dept.color} h-full rounded-full`} style={{ width: `${dept.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Financial ROI Bar */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Estimated Annual Financial ROI: <strong className="text-emerald-400 font-extrabold">$219,000 Productivity Gain</strong></span>
                </div>
                <span className="text-slate-400 text-[11px]">Payback Period: <strong className="text-slate-200">0.3 Months</strong></span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CapacityRadarPreview;
