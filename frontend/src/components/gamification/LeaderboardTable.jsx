import React from 'react';
import { Trophy, Award, Zap } from 'lucide-react';

export const LeaderboardTable = ({ items = [], type = 'individual' }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{type === 'individual' ? 'Individual Learner Ranking' : 'Department Capacity Ranking'}</span>
        </h3>
        <span className="text-xs text-slate-500">Live XP Standings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3 text-center w-16">Rank</th>
              <th className="px-5 py-3">{type === 'individual' ? 'Learner Name' : 'Department'}</th>
              <th className="px-5 py-3">{type === 'individual' ? 'Role' : 'Code'}</th>
              <th className="px-5 py-3 text-right">Total XP</th>
              <th className="px-5 py-3 text-right">{type === 'individual' ? 'Streak' : 'Avg Competency'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              const rankColors = {
                1: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                2: 'bg-slate-300/20 text-slate-200 border-slate-400/40',
                3: 'bg-amber-700/20 text-amber-400 border-amber-600/40',
              };

              return (
                <tr key={item.id || idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-extrabold border ${
                      isTop3 ? rankColors[rank] : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {rank}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-slate-100 flex items-center space-x-2">
                    {item.avatar && (
                      <img src={item.avatar} alt={item.name} className="w-6 h-6 rounded-full border border-slate-700" />
                    )}
                    <span>{item.name}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 uppercase font-semibold">{item.role || item.code}</td>
                  <td className="px-5 py-3 text-right font-extrabold text-amber-400 flex items-center justify-end space-x-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.xp || item.totalXP} XP</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-300">
                    {type === 'individual' ? `${item.streak} Days` : `${item.avgCompetency}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
