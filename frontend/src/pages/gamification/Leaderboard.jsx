import React, { useState, useEffect } from 'react';
import gamificationService from '../../services/gamificationService';
import LeaderboardTable from '../../components/gamification/LeaderboardTable';
import Loader from '../../components/common/Loader';
import { Trophy, Users, Building } from 'lucide-react';

export const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getLeaderboard()
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Loading live leaderboards..." />;

  const individual = data?.individual || [];
  const department = data?.department || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Leaderboard Rankings</span>
        </h1>
        <p className="text-sm text-slate-400">
          Recognizing top individual learners and high-capacity organizational departments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaderboardTable items={individual} type="individual" />
        <LeaderboardTable items={department} type="department" />
      </div>
    </div>
  );
};

export default Leaderboard;
