import React from 'react';

export const CompetencyHeatmap = ({ matrix = [] }) => {
  if (!matrix || matrix.length === 0) return null;

  const severityColors = {
    'No Gap': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Low': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Medium': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Critical': 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-100">Department Competency Heatmap Matrix</h3>
        <p className="text-xs text-slate-400">Color-coded skill gap severity across organizational departments</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3">Department</th>
              <th className="p-3 text-center">React.js</th>
              <th className="p-3 text-center">Node.js</th>
              <th className="p-3 text-center">PostgreSQL</th>
              <th className="p-3 text-center">AI RAG</th>
              <th className="p-3 text-center">Security</th>
              <th className="p-3 text-center">Avg Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrix.map((dept) => (
              <tr key={dept.department_id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-bold text-slate-200">{dept.department_name}</td>
                {(dept.skills || []).map((skill, sIdx) => (
                  <td key={sIdx} className="p-2 text-center">
                    <div className={`p-2 rounded-xl border text-[11px] font-bold ${severityColors[skill.severity] || severityColors.Low}`}>
                      <div>{skill.current_level}%</div>
                      <div className="text-[9px] opacity-80">Gap: {skill.gap}pt</div>
                    </div>
                  </td>
                ))}
                <td className="p-3 text-center font-extrabold text-slate-100">
                  {dept.avgGap}pt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetencyHeatmap;
