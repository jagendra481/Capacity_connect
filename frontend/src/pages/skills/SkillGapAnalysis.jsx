import React, { useState, useEffect } from 'react';
import skillService from '../../services/skillService';
import SkillGapCard from '../../components/skills/SkillGapCard';
import Loader from '../../components/common/Loader';
import { Target, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillGapAnalysis = () => {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillService.getSkillGap()
      .then(res => {
        if (res.data) setGapData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Calculating AI Skill Gap Analysis..." />;

  const data = gapData || {};
  const gaps = data.gaps || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
          <Target className="w-3.5 h-3.5" />
          <span>AI Skill Gap Analyzer</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Role Skill Gap Analysis — {data.userName || 'Trainee'}
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          Automated comparison formula: <span className="font-mono text-brand-300 font-bold">gap = required_level - current_level</span>.
          Gaps are classified into No Gap, Low, Medium, and Critical severity based on real assessment data.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Skills Assessed</span>
          <p className="text-2xl font-bold text-slate-100 mt-1">{data.totalSkillsAssessed || 5} Skills</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Gaps</span>
          <p className="text-2xl font-bold text-red-400 mt-1">{data.criticalGapsCount || 1} Skills</p>
          <p className="text-xs text-red-400 mt-0.5">Urgent intervention recommended</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Medium Gaps</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{data.mediumGapsCount || 2} Skills</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low / On Target</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{data.lowGapsCount || 2} Skills</p>
        </div>
      </div>

      {/* Skill Gap Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          <span>Individual Skill Gap Breakdowns</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gaps.map((item) => (
            <SkillGapCard key={item.skill_id} gapItem={item} />
          ))}
        </div>
      </div>

      {/* Navigation to Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-base font-bold text-slate-100">Ready to close identified critical gaps?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Explore personalized course recommendations tailored to your skill gaps.</p>
        </div>
        <Link
          to="/trainee/recommendations"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center space-x-2 flex-shrink-0"
        >
          <span>View Training Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
