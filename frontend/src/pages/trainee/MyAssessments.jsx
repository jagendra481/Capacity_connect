import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import Loader from '../../components/common/Loader';
import { FileCheck2, Clock, PlayCircle, History, Award, AlertCircle } from 'lucide-react';

export const MyAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentService.getAllAssessments()
      .then(res => {
        if (res.data) setAssessments(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <FileCheck2 className="w-6 h-6 text-purple-400" />
            <span>Assessment & Quiz Engine</span>
          </h1>
          <p className="text-sm text-slate-400">
            Automated competency tests, scenario evaluations, and skill gap calibration
          </p>
        </div>

        <Link
          to="/trainee/assessments/history"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold rounded-xl transition-colors shadow-md"
        >
          <History className="w-4 h-4 text-purple-400" />
          <span>Evaluation History</span>
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading available assessments..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((asm) => (
            <div
              key={asm.id}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-5 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {asm.category}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] uppercase font-extrabold rounded-md bg-slate-800 text-slate-300">
                    {asm.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {asm.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {asm.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{asm.time_limit_minutes || 30} mins</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pass: {asm.passing_score || 70}%</span>
                  </span>
                </div>

                <Link
                  to={`/assessments/${asm.id}`}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Assessment Test</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssessments;
