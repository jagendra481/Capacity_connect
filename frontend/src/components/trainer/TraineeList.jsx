import React from 'react';
import { Users, CheckCircle2, Award } from 'lucide-react';

export const TraineeList = ({ trainees = [] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Users className="w-4 h-4 text-brand-400" />
          <span>Assigned Trainees Progress</span>
        </h3>
        <span className="text-xs text-slate-400">{trainees.length} Trainees Enrolled</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Trainee Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3 text-center">Competency Score</th>
              <th className="px-5 py-3 text-center">Completed Courses</th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {trainees.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5 font-bold text-slate-100">{t.name}</td>
                <td className="px-5 py-3.5 text-slate-400">{t.email}</td>
                <td className="px-5 py-3.5 text-center font-extrabold text-brand-400">
                  {t.competencyScore}%
                </td>
                <td className="px-5 py-3.5 text-center font-bold text-purple-400">
                  {t.completedCourses} Courses
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TraineeList;
