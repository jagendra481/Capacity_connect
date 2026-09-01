import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import { Lock, Award, ArrowLeft, AlertCircle } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo-reset-token';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Set New Password</h1>
          <p className="text-sm text-slate-400 mt-1">Please enter your new password below</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/20"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
