import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import { getDashboardRoute } from '../../utils/roleUtils';
import {
  User,
  Mail,
  Lock,
  Award,
  ArrowRight,
  AlertCircle,
  LogIn,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    id: 'trainee',
    label: 'Trainee',
    subtitle: 'Learner',
    icon: GraduationCap,
    description: 'Access courses, take assessments, track competencies, and ask AI.',
    activeClass: 'bg-slate-800 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10',
  },
  {
    id: 'trainer',
    label: 'Trainer',
    subtitle: 'Instructor',
    icon: UserCheck,
    description: 'Manage courses, create assessments, and evaluate trainee progress.',
    activeClass: 'bg-slate-800 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10',
  },
  {
    id: 'administrator',
    label: 'Admin',
    subtitle: 'Platform Admin',
    icon: ShieldCheck,
    description: 'Administrator accounts require authorization. Cannot be created publicly.',
    activeClass: 'bg-slate-800 border-amber-500/80 text-amber-300 shadow-lg shadow-amber-500/10',
  },
];

export const Signup = () => {
  const { signup, signupWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Selected Role: 'trainee' | 'trainer' | 'administrator'
  const [selectedRole, setSelectedRole] = useState('trainee');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeRoleConfig = ROLE_OPTIONS.find((r) => r.id === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select your role (Trainee or Trainer) to create an account.');
      return;
    }

    if (selectedRole === 'administrator') {
      setError('Administrator accounts require authorization. Please select Trainee or Trainer to sign up.');
      return;
    }

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
        selectedRole,
      });

      if (res.data?.requiresEmailVerification) {
        localStorage.setItem('pending_verify_email', email);
        const sentAt = res.data?.otpSentTimestamp || Date.now();
        localStorage.setItem(`otp_sent_at_${email}`, String(sentAt));
        navigate('/verify-email', { state: { email, message: res.data?.message || 'Verification code sent.' } });
      } else {
        const userRole = res.data?.user?.role || selectedRole;
        navigate(getDashboardRoute(userRole), { replace: true });
      }
    } catch (err) {
      if (err?.accountExists) {
        setAccountExists(true);
        setError('An account with this email already exists. Please log in.');
      } else {
        setError(err?.response?.data?.message || err?.message || err || 'Failed to create account. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googlePayload) => {
    if (!selectedRole) {
      setError('Please select your role (Trainee or Trainer) before continuing with Google.');
      return;
    }

    if (selectedRole === 'administrator') {
      setError('Administrator accounts require authorization. Please select Trainee or Trainer to sign up.');
      return;
    }

    setError('');
    setAccountExists(false);
    setLoading(true);
    try {
      const res = await signupWithGoogle(googlePayload, selectedRole);
      const userRole = res.data?.user?.role || selectedRole;
      navigate(getDashboardRoute(userRole), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || err || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Join the Capacity Connect Platform</p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Select Account Role <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.id);
                    setError('');
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? role.activeClass
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1.5 transition-transform ${
                      isSelected ? 'scale-110' : 'opacity-70'
                    }`}
                  />
                  <span className="text-xs font-bold leading-tight">{role.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">{role.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Role Context Hint */}
          {activeRoleConfig ? (
            <div
              className={`mt-2.5 p-2.5 rounded-xl border flex items-start space-x-2 ${
                selectedRole === 'administrator'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-snug">
                <span className="font-semibold">{activeRoleConfig.label} Account:</span>{' '}
                {activeRoleConfig.description}
              </p>
            </div>
          ) : (
            <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center">
              <p className="text-[11px] text-cyan-400/90 font-medium">
                Mandatory: Click Trainee or Trainer to select your role.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-3">
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
        <div className="mb-5">
          <GoogleLoginButton onGoogleSuccess={handleGoogleSuccess} label="Continue with Google" />
          <div className="relative my-5 text-center">
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
            disabled={loading || selectedRole === 'administrator'}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 mt-4"
          >
            <span>
              {selectedRole === 'administrator'
                ? 'Admin Requires Authorization'
                : loading
                ? 'Sending verification code...'
                : `Create ${activeRoleConfig?.label || 'Trainee'} Account`}
            </span>
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
