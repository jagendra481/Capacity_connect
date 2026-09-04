import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { getDashboardRoute } from '../../utils/roleUtils';
import { User, Mail, Lock, Award, ArrowRight, AlertCircle, LogIn } from 'lucide-react';

export const Signup = () => {
  const { signup, signupWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAccountExists(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await signup({
        full_name: fullName,
        email,
        password,
        role: 'trainee', // Public signup is always trainee
      });

      if (res.data?.requiresEmailVerification) {
        localStorage.setItem('pending_verify_email', email);
        const sentAt = res.data?.otpSentTimestamp || Date.now();
        localStorage.setItem(`otp_sent_at_${email}`, String(sentAt));
        navigate('/verify-email', { state: { email, message: res.data?.message || 'Verification code sent.' } });
      } else {
        const userRole = res.data?.user?.role || 'trainee';
        navigate(getDashboardRoute(userRole), { replace: true });
      }
    } catch (err) {
      if (err?.accountExists) {
        setAccountExists(true);
        setError('An account with this email already exists. Please log in.');
      } else {
        setError(err?.message || err || 'Failed to create account. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googlePayload) => {
    setError('');
    setAccountExists(false);
    setLoading(true);
    try {
      const res = await signupWithGoogle(googlePayload);
      const userRole = res.data?.user?.role || 'trainee';
      navigate(getDashboardRoute(userRole), { replace: true });
    } catch (err) {
      setError(err?.message || err || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Join the Capacity Connect Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-3">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {accountExists && (
              <div className="pt-2 border-t border-red-500/20 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-bold rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In Now</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Google Authentication */}
        <div className="mb-6">
          <GoogleLoginButton onGoogleSuccess={handleGoogleSuccess} label="Continue with Google" />
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
              Or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 mt-4"
          >
            <span>{loading ? 'Sending verification code...' : 'Create Account'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
