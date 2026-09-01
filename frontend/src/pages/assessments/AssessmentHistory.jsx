import React, { useState, useEffect } from 'react';
import assessmentService from '../../services/assessmentService';
import Loader from '../../components/common/Loader';
import { History, Award, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AssessmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentService.getUserHistory()
      .then(res => {
        if (res.data) setHistory(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading evaluation history..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <History className="w-6 h-6 text-purple-400" />
          <span>Assessment History & Performance Analysis</span>
        </h1>
        <p className="text-sm text-slate-400">Track past evaluation attempts, scores, and pass status</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No assessment attempts recorded yet</h3>
          <p className="text-xs text-slate-400 mt-1">Take your first skill test from the assessments page.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Assessment Title</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Correct Answers</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-100">{attempt.assessment_title || 'Skill Evaluation'}</td>
                    <td className="px-6 py-4">
                      <span className={`font-extrabold ${attempt.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {attempt.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {attempt.correct_count} / {attempt.total_questions}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                          attempt.passed
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {attempt.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{attempt.passed ? 'Passed' : 'Failed'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{formatDate(attempt.completed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
