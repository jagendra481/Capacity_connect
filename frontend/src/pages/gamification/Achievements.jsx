import React, { useState, useEffect } from 'react';
import gamificationService from '../../services/gamificationService';
import BadgeCard from '../../components/gamification/BadgeCard';
import StreakCard from '../../components/gamification/StreakCard';
import XPCard from '../../components/gamification/XPCard';
import Loader from '../../components/common/Loader';
import { Award, Zap, History, Trophy } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const Achievements = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getUserGamification()
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Loading gamification & achievement milestones..." />;

  const badges = data?.badges || [];
  const history = data?.xpHistory || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
          <Zap className="w-3.5 h-3.5 fill-amber-300" />
          <span>Gamification & Recognition</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Achievements, XP Points & Badges
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          Earn XP points by completing courses, scoring high on technical evaluations, and maintaining study streaks.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <XPCard totalXP={data?.totalXP ?? 0} level={data?.level ?? 1} />
        <StreakCard streakDays={data?.streakDays ?? 0} />
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Badges Unlocked</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{badges.length}</span>
            <span className="text-sm text-slate-400 font-medium">Earned</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Unlocked Skill Badges</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((b) => (
            <BadgeCard key={b.id || b.badge_id} badge={b} />
          ))}
        </div>
      </div>

      {/* XP Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <History className="w-4 h-4 text-brand-400" />
          <span>XP Transaction History</span>
        </h3>
        <div className="space-y-2">
          {history.map((item) => (
            <div key={item.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">{item.description}</p>
                <p className="text-[10px] text-slate-500">{formatDate(item.created_at)}</p>
              </div>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                +{item.amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
