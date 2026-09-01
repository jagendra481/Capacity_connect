import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import { User, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export const EditProfile = () => {
  const { user, updateUserProfileState } = useAuth();
  const navigate = useNavigate();

  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    userService.getProfile()
      .then(res => {
        if (res.data) {
          const profile = res.data.profile || {};
          setDesignation(profile.designation || '');
          setBio(profile.bio || '');
          setAvatarUrl(profile.avatar_url || '');
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await userService.updateProfile({
        designation,
        bio,
        avatar_url: avatarUrl,
      });
      if (res.data) {
        updateUserProfileState(res.data);
        setSuccess('Profile updated successfully!');
        setTimeout(() => navigate('/trainee/profile'), 1500);
      }
    } catch (err) {
      setError(err || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading editable profile..." />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/trainee/profile')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Edit Profile</h1>
          <p className="text-sm text-slate-400">Update your public profile details</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-3 text-emerald-400 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Job Title / Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Bio & Professional Background
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a short bio about your technical focus and capacity goals..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/trainee/profile')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
