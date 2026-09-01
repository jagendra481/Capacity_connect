import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import { User, Mail, Shield, Building, Award, Zap, Edit3, Calendar } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile()
      .then(res => {
        if (res.data) setProfileData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading profile details..." />;

  const data = profileData || user;
  const profile = data.profile || {};

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Profile</h1>
          <p className="text-sm text-slate-400">View your competency credentials and account metadata</p>
        </div>
        <Link
          to="/trainee/profile/edit"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.full_name || 'User')}`}
            alt={data.full_name}
            className="w-24 h-24 rounded-2xl border-2 border-brand-500 object-cover shadow-lg"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <h2 className="text-xl font-bold text-slate-100">{data.full_name}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {data.role}
              </span>
            </div>
            <p className="text-sm text-slate-400">{profile.designation || 'Learner / Employee'}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1 pt-1">
              <Building className="w-3.5 h-3.5" />
              <span>{data.department_name || 'Department'}</span>
            </p>
          </div>
        </div>

        {profile.bio && (
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About Me</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-amber-400 mb-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span className="text-lg font-bold">{profile.xp || 0}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Total XP Points</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-brand-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-lg font-bold">{profile.competency_score || 0}%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Competency Index</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-lg font-bold">{profile.streak_days || 0} Days</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Learning Streak</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account Metadata</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Email:</span>
              <span className="font-medium">{data.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Status:</span>
              <span className="font-medium text-emerald-400 capitalize">{data.status || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
