import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import ProgressCard from '../../components/dashboard/ProgressCard';
import CompetencyCard from '../../components/dashboard/CompetencyCard';
import RecommendationCard from '../../components/dashboard/RecommendationCard';
import AchievementCard from '../../components/dashboard/AchievementCard';
import CertificateCard from '../../components/dashboard/CertificateCard';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import SkillChart from '../../components/dashboard/SkillChart';
import { Zap, BookOpen, Target, FileCheck2, Award, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TraineeDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getTraineeDashboard()
      .then(res => {
        if (res.data) setDashboardData(res.data);
      })
      .catch(err => console.error('Failed to load dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Loading personalized Trainee Dashboard..." />;

  const data = dashboardData || {};
  const userData = data.user || user;
  const profile = userData.profile || {};

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 border border-brand-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <Zap className="w-3.5 h-3.5 fill-brand-300" />
            <span>Trainee Capacity Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Welcome back, {userData.full_name || 'Learner'}!
          </h1>
          <p className="text-sm text-slate-300">
            Assess → Identify Skill Gap → Recommend Training → Learn → Practice → Evaluate → Certify → Measure Improvement
          </p>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard progress={data.learningProgress || 68} />
        <CompetencyCard score={data.competencyScore || profile.competency_score || 72} />

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Learning Streak</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{data.learningStreak || profile.streak_days || 5}</span>
            <span className="text-sm text-slate-400 font-medium">Days</span>
          </div>
          <p className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
            <span>+{data.xpPoints || profile.xp || 450} Total XP Earned</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Assessments</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{(data.pendingAssessments || []).length}</span>
            <span className="text-sm text-slate-400 font-medium">Due soon</span>
          </div>
          <Link to="/trainee/assessments" className="text-xs text-purple-400 font-semibold hover:underline block">
            View Assessment Schedule →
          </Link>
        </div>
      </div>

      {/* Main Charts & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Competency Chart */}
          <SkillChart competencies={data.competencies || []} />

          {/* Pending Assessments List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-purple-400" />
                <span>Pending Competency Evaluations</span>
              </h4>
              <Link to="/trainee/assessments" className="text-xs text-brand-400 font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {(data.pendingAssessments || []).map((assessment) => (
                <div
                  key={assessment.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-sm font-bold text-slate-200">{assessment.title}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {assessment.questionsCount} Questions • {assessment.timeLimitMinutes} mins • Difficulty: {assessment.difficulty}
                    </p>
                  </div>
                  <Link
                    to={`/trainee/assessments`}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Start Test
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Verified Certificates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Badges & Achievements</span>
              </h4>
              <div className="space-y-2">
                {(data.achievements || []).map((item) => (
                  <AchievementCard key={item.id} achievement={item} />
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Verified Certificates</span>
              </h4>
              <div className="space-y-2">
                {(data.certificates || []).map((cert) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Recommendations & Notifications */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Target className="w-4 h-4 text-brand-400" />
              <span>Recommended Training</span>
            </h4>
            {(data.recommendations || []).map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>

          <NotificationPanel />
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboard;
