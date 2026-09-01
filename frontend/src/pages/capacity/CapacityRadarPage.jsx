import React, { useState, useEffect } from 'react';
import capacityRadarService from '../../services/capacityRadarService';
import CapacityRadarChart from '../../components/capacity/CapacityRadarChart';
import CapacityScoreCard from '../../components/capacity/CapacityScoreCard';
import ROICalculator from '../../components/capacity/ROICalculator';
import Loader from '../../components/common/Loader';
import { Activity, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export const CapacityRadarPage = () => {
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    capacityRadarService.getOrganizationalRadar()
      .then(res => {
        if (res.data) setRadarData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Rendering Organizational Capacity Radar..." />;

  const dimensions = radarData?.dimensions || [];

  return (
    <div className="space-y-6">
      {/* USP Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>CAPACITY CONNECT MAIN USP</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Organizational Capacity Radar & Skill Readiness Matrix
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          Multi-dimensional radar visualizer analyzing Technical Competency, Process Maturity, Tool Proficiency, Domain Knowledge, AI Readiness, and Leadership across the enterprise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CapacityRadarChart dimensions={dimensions} />
        </div>

        <div className="lg:col-span-1">
          <CapacityScoreCard
            capacityScore={radarData?.capacityScore || 74.5}
            skillReadiness={radarData?.skillReadinessIndex || 82}
            riskLevel={radarData?.riskLevel || 'MEDIUM_RISK'}
          />
        </div>
      </div>

      <ROICalculator />
    </div>
  );
};

export default CapacityRadarPage;
