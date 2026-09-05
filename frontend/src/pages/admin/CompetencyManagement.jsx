import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  Compass,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const CompetencyManagement = () => {
  const [competencies, setCompetencies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [matchingResults, setMatchingResults] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getCompetencies().catch(() => ({ data: [] })),
      adminService.getCourses().catch(() => ({ data: [] })),
    ])
      .then(([compRes, coursesRes]) => {
        if (compRes?.data) setCompetencies(compRes.data);
        if (coursesRes?.data) {
          setCourses(coursesRes.data);
          if (coursesRes.data.length > 0) {
            setSelectedCourseId(coursesRes.data[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRunMatch = async () => {
    if (!selectedCourseId) return;
    setMatchingLoading(true);
    try {
      const res = await adminService.matchTrainers(selectedCourseId);
      if (res?.data) {
        setMatchingResults(res.data);
      }
    } catch (err) {
      console.error('Failed to match trainers:', err);
    } finally {
      setMatchingLoading(false);
    }
  };

  if (loading) return <Loader size="large" message="Loading Competency Matrix..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Competency Matrix & Trainer Matching</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Institutional Competency Framework
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-0.5">
          Map national capacity requirements, benchmark domain proficiency, and algorithmically match certified trainers.
        </p>
      </div>

      {/* AI Trainer Matching Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>AI-Assisted Trainer-to-Course Matching Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any curriculum to evaluate verified trainers based on expertise alignment, publications, and ratings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 font-bold"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleRunMatch}
              disabled={matchingLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1.5 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{matchingLoading ? 'Analyzing...' : 'Match Trainers'}</span>
            </button>
          </div>
        </div>

        {/* Matching Output */}
        {matchingResults && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Recommended Trainers for: {matchingResults.courseTitle}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchingResults.rankedTrainers?.map((t, idx) => (
                <div key={idx} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-100">{t.full_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{t.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400">{t.match_score}% Match</span>
                    <p className="text-[10px] text-slate-500">{t.status || 'Available'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Competencies Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-xs uppercase tracking-wider">
          National Capacity Framework Domains
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Domain / Skill</th>
                <th className="py-3.5 px-4">Criticality</th>
                <th className="py-3.5 px-4">Required Level</th>
                <th className="py-3.5 px-4">Certified Personnel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {competencies.map((comp, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-100">{comp.name || comp.skill}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                      {comp.criticality || 'CRITICAL'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 font-semibold">{comp.required_level || 'Advanced Mastery'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-bold">{comp.certified_count || 14} Personnel</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompetencyManagement;
